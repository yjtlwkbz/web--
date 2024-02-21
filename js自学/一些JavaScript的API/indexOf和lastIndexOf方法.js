// 1.获取最后一位字符位置==》lastIndexOf()
function lastIndexOfTest() {
    // 定义初始参数
    var text = "xxxxxx78xxx78";
    // 获取最后78字符串的位置
    var number = text.lastIndexOf("78");
    // 打印位置数字
    console.log(number); //显示后面的78位置
}
lastIndexOfTest()

// 2.获取首次一位字符位置==》lastIndexOf()
function indexOfTest() {
    // 定义初始参数
    var text = "xxxxxx78xxx78";
    // 获取首次78字符串的位置
    var number = text.indexOf("78");
    // 打印位置数字
    console.log(number); //显示前面的78位置
}
indexOfTest()