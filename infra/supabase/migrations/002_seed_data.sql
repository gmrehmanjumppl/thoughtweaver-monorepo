-- Thoughtweaver Database Schema
-- Seed Data Migration
-- Run this AFTER the initial schema migration

-- Insert default assistants
INSERT INTO assistants (id, name, description, avatar_url, color, system_prompt, personality, is_default) VALUES
('all-rounder', 'All-Rounder', 'Balanced assistant for general tasks', '🤖', 'purple', 'You are a helpful AI assistant.', '{"creativity": 50, "analytical": 50, "empathy": 50, "assertiveness": 50, "detailOriented": 50, "strategic": 50}'::jsonb, true),
('the-analyst', 'The Analyst', 'Data-driven and analytical thinking', '📊', 'blue', 'You are an analytical AI assistant focused on data and logic.', '{"creativity": 30, "analytical": 90, "empathy": 40, "assertiveness": 60, "detailOriented": 85, "strategic": 70}'::jsonb, true),
('the-creative', 'The Creative', 'Creative and innovative solutions', '🎨', 'pink', 'You are a creative AI assistant focused on innovation.', '{"creativity": 95, "analytical": 40, "empathy": 60, "assertiveness": 50, "detailOriented": 30, "strategic": 50}'::jsonb, true);

-- Insert default workflows
INSERT INTO workflows (id, name, description, icon, steps, is_default) VALUES
('build-as-we-go', 'AI-assisted workflow', 'Explore ideas naturally without a predefined structure', 'Sparkles', '[]'::jsonb, true),
('strategic-ideation', 'Strategic Ideation', 'Generate and refine innovative solutions through structured creative thinking', 'Lightbulb', '[{"id":"si-1","order":1,"name":"Frame","roleType":"human","description":"Define problem, objectives, constraints"},{"id":"si-2","order":2,"name":"Ideate","roleType":"ai","description":"Generate creative and innovative solutions","assistant":"creative-innovator"},{"id":"si-3","order":3,"name":"Assess","roleType":"human","description":"Evaluate feasibility and alignment"},{"id":"si-4","order":4,"name":"Refine","roleType":"ai","description":"Polish and improve selected concepts","assistant":"incisive-idea-improver"},{"id":"si-5","order":5,"name":"Synthesise","roleType":"human","description":"Select and integrate best concepts"}]'::jsonb, true);

