/**
 * @file Ebnf grammar for tree-sitter
 * @author chiyizi <ch1y1z1kun@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "ebnf",

  extras: ($) => [/\s+/, $.comment],

  conflicts: ($) => [],

  rules: {
    grammar: ($) => repeat1($.rule),

    rule: ($) =>
      seq(
        field("name", $.identifier),
        field("assignment", choice("=", "::=", ":=")),
        field("value", $.expression),
        optional(";"), // 兼容末尾分号可选
      ),

    // expression ::= sequence ('|' sequence)*
    expression: ($) => seq($.sequence, repeat(seq("|", $.sequence))),

    // sequence ::= term (',' term)*   // 如果你不喜欢逗号，也可改为空白连接：
    sequence: ($) =>
      seq(
        $.term,
        repeat(seq(",", $.term)), // 允许可选逗号/空白连接
      ),

    term: ($) =>
      choice(
        $.group,
        $.optional,
        $.repetition,
        $.literal,
        $.special_sequence,
        $.identifier,
      ),

    group: ($) => seq("(", $.expression, ")"),
    optional: ($) => seq("[", $.expression, "]"),
    repetition: ($) => seq("{", $.expression, "}"),

    // ISO-14977 允许 '...' 或 "..."
    literal: ($) =>
      choice(
        seq("'", repeat(choice(/[^'\\]/, /\\./)), "'"),
        seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'),
      ),

    // ISO 有 ? ... ? 的 special sequence，可作为语义注释或扩展
    special_sequence: ($) => seq("?", repeat(/[^?]/), "?"),

    // identifier：根据方言决定是否用 <...>
    identifier: ($) =>
      choice(
        // <identifier>
        seq("<", /[A-Za-z_][A-Za-z0-9_-]*/, ">"),
        // 裸标识符
        /[A-Za-z_][A-Za-z0-9_-]*/,
      ),

    // 注释：这里先做非嵌套版，嵌套版建议移到 scanner
    comment: ($) => token(seq("(*", repeat(choice(/[^*]/, /\*[^)]/)), "*)")),
  },
});
