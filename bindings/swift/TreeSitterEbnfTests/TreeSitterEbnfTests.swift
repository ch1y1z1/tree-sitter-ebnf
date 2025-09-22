import XCTest
import SwiftTreeSitter
import TreeSitterEbnf

final class TreeSitterEbnfTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_ebnf())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Ebnf grammar")
    }
}
