//: Playground - noun: a place where people can play

import UIKit

func weight(value: Double, locale: Locale) -> String? {
    let formatter = NumberFormatter()
    
    formatter.numberStyle = .decimal
    formatter.decimalSeparator = ","
    formatter.maximumFractionDigits = 1
    formatter.minimumFractionDigits = 0
    return formatter.string(from: NSNumber(value: value))
}

let de = Locale(identifier: "de_DE")
let us = Locale(identifier: "en_US")

print(weight(value: 170, locale: us)!)
print(weight(value: 170.29, locale: us)!)
print(weight(value: 170, locale: de)!)
print(weight(value: 170.29, locale: de)!)


