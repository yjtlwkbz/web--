//set()方法可以去重数组
// 1、创建 Set
// 1.1、new Set()方式创建
let v1 = new Set()

// 1.2、通过传入数组方式创建
let v2 = new Set([1,2,3,3,5])

// 2、添加元素
// 使用 add 方法
v2.add(1)
//注意！！它返回的是一个布尔值，它做完这些事后，成功了就true，失败了就false

// 3、删除元素
// 使用 delete 方法
v2.add(1)
v2.add(5)
v2.delete(5)
//注意！！它返回的是一个布尔值，它做完这些事后，成功了就true，失败了就false

// 4、获取 Set 中元素个数
// 使用 size
v2.size

// 5、判断 Set 中是否包含某个元素
// 使用 has 方法
v2.add(1)
v2.add(5)
v2.has(5)

// 6、遍历 Set
// 6.1、forEach形式
v2.forEach(t=>{
    console.log(t)
})
console.log(`<br>`)

// 6.2、for of 形式			
for(let t of v2) {
    console.log(t)
}

// 7、Set 转换成数组
// 使用 Array.from 方法
let a = Array.from(v2)