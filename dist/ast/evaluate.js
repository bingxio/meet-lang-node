"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Evaluate = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// export let variableMap = {};
// export let evaluate = ast => {
//     let current = 0;
//     let nodeList = ast.body;
//     while (current < nodeList.length) {
//         let node = nodeList[current];
//         if (node.type == 'DefineFuckExpression' &&
//             typeof(node.name) != 'undefined' &&
//             typeof(node.value) != 'undefined') {
//                 variableMap[node.name] = node.value;
//                 current ++;
//                 continue;
//         }
//         if ((node.type == 'PrintFuckExpression' && node.name != 'printLine') || (node.type == 'PrintLineFuckExpression' &&
//             typeof(node.name) != 'undefined')) {
//                 let nextNode = nodeList[++ current];
//                 if (typeof(nextNode) != 'undefined') {
//                     // 如果是计算表达式
//                     if (nextNode.type == 'ComputationalExpression' &&
//                         typeof(nextNode.name) != 'undefined' &&
//                         typeof(nextNode.param) != 'undefined') {
//                             let left = nextNode.param[0].value;
//                             let right = nextNode.param[1].value;
//                             let tLeft = 0;
//                             let tRight = 0;
//                             let num = 0;
//                             if (parseInt(left) != NaN) tLeft = parseInt(left);
//                             if (parseInt(right) != NaN) tRight = parseInt(right);
//                             if (variableMap.hasOwnProperty(left)) {
//                                 if (parseInt(variableMap[left]) != NaN)
//                                     tLeft = parseInt(variableMap[left]);
//                                 else
//                                     tLeft = variableMap[left];
//                             }
//                             if (variableMap.hasOwnProperty(right)) {
//                                 if (parseInt(variableMap[right]) != NaN)
//                                     tRight = parseInt(variableMap[right]);
//                                 else
//                                     tRight = variableMap[right];
//                             }
//                             switch (nextNode.name) {
//                                 case '+':
//                                     num = tLeft + tRight;
//                                     break;
//                                 case '-':
//                                     num = tLeft - tRight;
//                                     break;
//                                 case '*':
//                                     num = tLeft * tRight;
//                                     break;
//                                 case '/':
//                                     num = tLeft / tRight;
//                                     break;
//                             }
//                             console.log(num);
//                             // skip ComputationalExpression.
//                             current ++;
//                             continue;
//                     }
//                 }
//                 // 在库里找变量名和变量值
//                 if (variableMap.hasOwnProperty(node.name)) {
//                     if (node.type == 'PrintFuckExpression') process.stdout.write(variableMap[node.name]);
//                     if (node.type == 'PrintLineFuckExpression') console.log(variableMap[node.name]);
//                 } else {
//                     throw new SyntaxError('没有找到变量：' + node.name);
//                 }
//                 continue;
//         }
//         if (node.type == 'PrintFuckExpression' && node.name == 'printLine') {
//             console.log('');
//             current ++;
//             continue;
//         }
//         throw new TypeError(node.type);
//     }
//     return true;
// }
var Evaluate = function Evaluate() {
  _classCallCheck(this, Evaluate);
};

exports.Evaluate = Evaluate;