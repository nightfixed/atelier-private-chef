package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

const (
	anthropicAPIURL = "https://api.anthropic.com/v1/messages"
	anthropicModel  = "claude-sonnet-4-5"
	anthropicVersion = "2023-06-01"
)

// AnthropicProvider calls the Anthropic Messages API.
// Inject via main.go when ANTHROPIC_API_KEY is set.
type AnthropicProvider struct {
	apiKey string
	client *http.Client
}

// NewAnthropicProvider creates a new provider. Panics if apiKey is empty.
func NewAnthropicProvider(apiKey string) *AnthropicProvider {
	return &AnthropicProvider{
		apiKey: apiKey,
		client: &http.Client{},
	}
}

// anthropicRequest is the body sent to POST /v1/messages.
type anthropicRequest struct {
	Model     string              `json:"model"`
	MaxTokens int                 `json:"max_tokens"`
	System    string              `json:"system"`
	Messages  []anthropicMessage  `json:"messages"`
}

type anthropicMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// anthropicResponse is the subset of the Anthropic response we care about.
type anthropicResponse struct {
	Content []struct {
		Type string `json:"type"`
		Text string `json:"text"`
	} `json:"content"`
	Error *struct {
		Type    string `json:"type"`
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

func (p *AnthropicProvider) call(ctx context.Context, system, userMsg string, maxTokens int) (string, error) {
	body := anthropicRequest{
		Model:     anthropicModel,
		MaxTokens: maxTokens,
		System:    system,
		Messages:  []anthropicMessage{{Role: "user", Content: userMsg}},
	}
	payload, err := json.Marshal(body)
	if err != nil {
		return "", fmt.Errorf("marshal: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, anthropicAPIURL, bytes.NewReader(payload))
	if err != nil {
		return "", fmt.Errorf("new request: %w", err)
	}
	req.Header.Set("x-api-key", p.apiKey)
	req.Header.Set("anthropic-version", anthropicVersion)
	req.Header.Set("content-type", "application/json")

	resp, err := p.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("http: %w", err)
	}
	defer resp.Body.Close()

	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("read body: %w", err)
	}

	var ar anthropicResponse
	if err := json.Unmarshal(raw, &ar); err != nil {
		return "", fmt.Errorf("unmarshal: %w", err)
	}
	if ar.Error != nil {
		return "", fmt.Errorf("anthropic error %s: %s", ar.Error.Type, ar.Error.Message)
	}
	if len(ar.Content) == 0 {
		return "", fmt.Errorf("empty response from Anthropic")
	}
	return ar.Content[0].Text, nil
}

// GenerateMenu calls Claude to produce a structured tasting menu JSON.
func (p *AnthropicProvider) GenerateMenu(ctx context.Context, req MenuRequest) (*MenuResponse, error) {
	system := SystemPrompt(req)
	text, err := p.call(ctx, system, "Generează meniul acum.", 2048)
	if err != nil {
		return nil, err
	}

	// Claude sometimes wraps JSON in ```json ... ``` — strip it.
	text = strings.TrimSpace(text)
	if idx := strings.Index(text, "{"); idx > 0 {
		text = text[idx:]
	}
	if idx := strings.LastIndex(text, "}"); idx >= 0 && idx < len(text)-1 {
		text = text[:idx+1]
	}

	var menu MenuResponse
	if err := json.Unmarshal([]byte(text), &menu); err != nil {
		return nil, fmt.Errorf("parse menu JSON: %w (raw: %.200s)", err, text)
	}
	return &menu, nil
}

// Chat handles multi-turn conversation using Claude.
func (p *AnthropicProvider) Chat(ctx context.Context, req ChatRequest) (*ChatResponse, error) {
	system := `Ești asistentul virtual al Atelier Private Dining, un serviciu exclusiv de private chef din Cluj-Napoca, România.
Chef Răzvan gătește în casele oaspeților sau în spații private — meniuri de degustare personalizate cu ingrediente carpatice rare.
Răspunzi în română, elegant și cald, în maximum 3 propoziții.
Nu inventezi prețuri sau date — pentru detalii specifice, invită oaspetele să completeze formularul de rezervare sau să scrie la exquisitefoodtravel@yahoo.com.`

	if len(req.Messages) == 0 {
		return &ChatResponse{Reply: "Cu ce vă pot ajuta?"}, nil
	}

	// Convert conversation history — Anthropic requires alternating user/assistant roles
	// and the first message must be "user".
	var msgs []anthropicMessage
	for _, m := range req.Messages {
		role := m.Role
		if role == "bot" || role == "assistant" {
			role = "assistant"
		} else {
			role = "user"
		}
		// Skip consecutive same-role messages (keep last)
		if len(msgs) > 0 && msgs[len(msgs)-1].Role == role {
			msgs[len(msgs)-1].Content = m.Content
		} else {
			msgs = append(msgs, anthropicMessage{Role: role, Content: m.Content})
		}
	}
	// Anthropic requires first message to be "user"
	for len(msgs) > 0 && msgs[0].Role != "user" {
		msgs = msgs[1:]
	}
	if len(msgs) == 0 {
		return &ChatResponse{Reply: "Cu ce vă pot ajuta?"}, nil
	}

	// Build a single user turn that embeds the full history for simplicity,
	// or send the last user message if history is short.
	lastUser := msgs[len(msgs)-1].Content
	if msgs[len(msgs)-1].Role != "user" {
		lastUser = "Continuă conversația."
	}

	// Use multi-turn if there's prior context
	var callMessages []anthropicMessage
	if len(msgs) > 1 {
		callMessages = msgs
	} else {
		callMessages = []anthropicMessage{{Role: "user", Content: lastUser}}
	}

	body := anthropicRequest{
		Model:     anthropicModel,
		MaxTokens: 512,
		System:    system,
		Messages:  callMessages,
	}
	payload, err := json.Marshal(body)
	if err != nil {
		return nil, fmt.Errorf("marshal: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, anthropicAPIURL, bytes.NewReader(payload))
	if err != nil {
		return nil, fmt.Errorf("new request: %w", err)
	}
	httpReq.Header.Set("x-api-key", p.apiKey)
	httpReq.Header.Set("anthropic-version", anthropicVersion)
	httpReq.Header.Set("content-type", "application/json")

	resp, err := p.client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("http: %w", err)
	}
	defer resp.Body.Close()

	raw, _ := io.ReadAll(resp.Body)
	var ar anthropicResponse
	if err := json.Unmarshal(raw, &ar); err != nil {
		return nil, fmt.Errorf("unmarshal: %w", err)
	}
	if ar.Error != nil {
		return nil, fmt.Errorf("anthropic error %s: %s", ar.Error.Type, ar.Error.Message)
	}
	if len(ar.Content) == 0 {
		return nil, fmt.Errorf("empty response")
	}
	return &ChatResponse{Reply: ar.Content[0].Text}, nil
}
