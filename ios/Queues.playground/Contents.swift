//: Playground - noun: a place where people can play

import UIKit

let workGroup = DispatchGroup()
let taskQueue = DispatchQueue(label: "irh.task")
let workQueue = DispatchQueue(label: "irh.work")

// equivalent to pedometer query for a day
func task(index: Int) {
    let taskSemaphore = DispatchSemaphore(value: 0)
    taskQueue.async {
        print("task \(index) started: \(Date())")
        sleep(1)
        print("task \(index) completed: \(Date())")
        taskSemaphore.signal()
    }
    taskSemaphore.wait()
}

// equivalent to pedometer query for a period
func work(index: Int) {
    workQueue.async {
        print("work \(index) started: \(Date())")
        workGroup.enter()
        for i in 1...2 {
            task(index: i)
        }
        workGroup.leave()
        print("work \(index) completed: \(Date())")
    }
}

let workSemaphore = DispatchSemaphore(value: 0)

work(index: 1)
print("work 1 defined")
work(index: 2)
print("work 2 defined")
workGroup.notify(queue: DispatchQueue.main) {
    workSemaphore.signal()
}
workSemaphore.wait()
print("whole work completed")

//let workGroup = DispatchGroup()
//let workQueue = DispatchQueue(label: "irh.work")
//
//workGroup.notify(queue: DispatchQueue.main) {
//    print("done")
//}

