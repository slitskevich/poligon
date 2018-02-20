//
//  main.swift
//  LocaleNumber
//
//  Created by slava litskevich on 01/12/16.
//  Copyright © 2016 sl. All rights reserved.
//

import Foundation

print("Hello, World!")

func weight(value: Double, locale: Locale) -> String? {
    let formatter = NumberFormatter()
    formatter.locale = locale
    formatter.numberStyle = .decimal
    formatter.minimumFractionDigits = 0
    formatter.maximumFractionDigits = 1
    return formatter.string(from: NSNumber(value: value))
}

func reward(value: Double, locale: Locale) -> String? {
    let formatter = NumberFormatter()
    formatter.locale = locale
    formatter.numberStyle = .currency
    formatter.currencyCode = "USD"
    formatter.minimumFractionDigits = 0
    formatter.maximumFractionDigits = 2
    return formatter.string(from: NSNumber(value: value))
}

func summary(value: Date, locale: Locale) -> String? {
    let formatter = DateFormatter()
    formatter.locale = locale
    formatter.dateStyle = .full
    formatter.doesRelativeDateFormatting = true
    
    return formatter.string(from: value)
}

func dateFor(dateString: String) -> Date? {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy.MM.dd HH:mm"
    return formatter.date(from: dateString)
}

let de = Locale(identifier: "de_DE")
let us = Locale(identifier: "en_US")

if let us1 = weight(value: 1702.0, locale: us), let us2 = weight(value: 1702.29, locale: us), let de1 = weight(value: 1702.21, locale: de) {
    print(us1)
    print(us2)
    print(de1)
}

if let us1 = reward(value: 1702.0, locale: us), let us2 = reward(value: 1702.2916, locale: us), let de1 = reward(value: 1702.2179, locale: de) {
    print(us1)
    print(us2)
    print(de1)
}

let today = Date()
if let us1 = summary(value: today, locale: us), let de1 = summary(value: today, locale: de) {
    print(us1)
    print(de1)
}

if let y = dateFor(dateString: "2016.11.30 13:30"), let us1 = summary(value: y, locale: us), let de1 = summary(value: y, locale: de) {
    print(us1)
    print(de1)
}

if let y = dateFor(dateString: "2016.11.29 13:30"), let us1 = summary(value: y, locale: us), let de1 = summary(value: y, locale: de) {
    print(us1)
    print(de1)
}

if let y = dateFor(dateString: "2016.11.28 13:30"), let us1 = summary(value: y, locale: us), let de1 = summary(value: y, locale: de) {
    print(us1)
    print(de1)
}
