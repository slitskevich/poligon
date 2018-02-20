//: Playground - noun: a place where people can play

import UIKit

let source = ["A", "B", "C"]
var result: [Int]? = nil
result = source.map({(item: String) -> (Int) in
    return source.index(of: item) ?? 0
})
print(result!)
