package tree_sitter_ebnf_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_ebnf "github.com/tree-sitter/tree-sitter-ebnf/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_ebnf.Language())
	if language == nil {
		t.Errorf("Error loading Ebnf grammar")
	}
}
