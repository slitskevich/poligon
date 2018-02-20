//: Playground - noun: a place where people can play

import UIKit

var str = "Beef Tenderloin (Lean Only, Trimmed to 1/8\" Fat, Select Grade)"

//            replace(/[^\\]"/g, '\\"')
if let regex = try? NSRegularExpression(pattern: "\\\"", options: .caseInsensitive) {
    print("regex")
    let modString = regex.stringByReplacingMatches(in: str, options: .withTransparentBounds, range: NSMakeRange(0, str.characters.count), withTemplate: "\"")
    print(modString)
}
print("done")
