//
//  main.swift
//  Parser
//
//  Created by slava litskevich on 02/12/16.
//  Copyright © 2016 sl. All rights reserved.
//

import Foundation

print("Hello, World!")
let title = "[B]redeem[/b] points and [b]quit[/b]"

func parse(title: String) {
    let BOLD_OPENING = "[b]"
    let BOLD_CLOSING = "[/b]"
    
    func findTagRegions(title: String) -> (parsed: String, regions: [Range<String.Index>]) {
        var parsedTitle = title
        var regions = [Range<String.Index>]()
        var position = parsedTitle.startIndex
        while let opening = parsedTitle.range(of: BOLD_OPENING, options: .caseInsensitive, range: position ..< parsedTitle.endIndex, locale: Locale.current), let _ = parsedTitle.range(of: BOLD_CLOSING, options: .caseInsensitive, range: opening.lowerBound ..< parsedTitle.endIndex, locale: Locale.current) {
            let boldStart = opening.lowerBound
            parsedTitle.removeSubrange(opening)
            if let closing = parsedTitle.range(of: BOLD_CLOSING, options: .caseInsensitive, range: boldStart ..< parsedTitle.endIndex, locale: Locale.current) {
                let boldEnd = parsedTitle.index(before: closing.lowerBound)
                parsedTitle.removeSubrange(closing)
                regions.append(boldStart ..< boldEnd)
                position = boldEnd
            }
        }
        return (parsed: parsedTitle, regions: regions)
    }
    
    let bold = findTagRegions(title: title)
}



