const Tree = function (arr = [], root = null) {
    this.arr = arr
    this.root = root
}

const Node = function (data = null, left = null, right = null) {
    this.data = data
    this.left = left
    this.right = right
}

// [1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345]
/*

               
                  8
              /        \ 
             /          \
            4            67
          /   \         /   \
         3     7       23    6345
        /     /       /       /
       1     5      9      324


*/
function buildTree(arr) {
    // console.log(arr)
    if (arr.length <= 0) return
    if (arr.length === 1) return new Node(arr[0])
    arr.sort((a, b) => a - b)
    arr = removeDuplicates(arr)
    // console.log(arr)

    let middle = Math.floor(arr.length / 2)
    let left = buildTree(arr.slice(0, middle))
    let right = buildTree(arr.slice(middle + 1,))

    let newNode = new Node(arr[middle], left, right)
    return newNode
}

function insert(value, tree) {
    let newNode = new Node(value)
    if (tree.data === value) return
    if (value < tree.data) {
        if (!tree.left) {
            console.log('inserting : ', value)
            tree.left = newNode
        } else {
            return insert(value, tree.left)
        }
    }
    if (value > tree.data) {
        if (!tree.right) {
            console.log('inserting : ', value)
            tree.right = newNode
        } else {
            return insert(value, tree.right)
        }
    }
}

function deleteFromTree(value, tree) {
    console.log('removing : ', value)
    if (value === null) return
    let parentNode = tree
    let dir = null
    while (tree && value !== tree.data) {
        parentNode = tree
        if (value < tree.data) {
            dir = 'left'
            tree = tree.left
        } else { // >
            dir = 'right'
            tree = tree.right
        }
    }
    if (!tree) return // not found
    // node found.
    //case 1. not child
    if (!tree.left && !tree.right) return parentNode[dir] = null
    // case 2. only 1 child
    if (!tree.left === !!tree.right) { // XOR
        return tree.left ? parentNode[dir] = tree.left
            : parentNode[dir] = tree.right
    }
    // case 3. with 2 children.
    if (tree.left && tree.right) {
        let nearestBigger = tree.right
        let parentNB = null
        while (nearestBigger.left) {
            parentNB = nearestBigger
            nearestBigger = nearestBigger.left
        }
        // found the nearest bigger
        // replace tree with newNode from nearestbigger.data, inherit original tree left/right
        let newNode = new Node(nearestBigger.data, tree.left, tree.right)
        if (parentNode === tree) { // if value at ROOT
            tree.data = nearestBigger.data
        } else {
            parentNode[dir] = newNode
        }
        // remove neareset bigger from its tree
        if (!parentNB) { // if no child, no need recursion
            return newNode.right = null
        }
        deleteFromTree(nearestBigger.data, parentNB)

    }
}

function find(value, tree) {
    while (tree && tree.data !== value) {
        if (value < tree.data) {
            tree = tree.left
        } else {
            tree = tree.right
        }
    }
    if (!tree) return null
    // found
    // console.log(tree)
    return tree
}

function levelOrder(fn, tree) { // Breadth-first Search, //with loop method
    // return
    let queue = []
    let returnArr = [tree]
    queue.push(tree)
    while (queue.length > 0) {
        tree = queue.shift()
        if (fn === null) {
            if (tree.left) returnArr.push(tree.left)
            if (tree.right) returnArr.push(tree.right)
        } else {
            fn(tree)
        }
        if (tree.left) queue.push(tree.left)
        if (tree.right) queue.push(tree.right)
    }
    if (fn === null) return returnArr
}

function levelOrderRec(fn, tree, queue = [tree], returnArr = [tree]) { // Breadth-first Search, with  Recursion method
    if (queue.length < 1 && !fn) return returnArr
    if (queue.length < 1) return
    let first = queue.shift()
    if (fn) {
        fn(first)
    } else {
        if (first.left) returnArr.push(first.left)
        if (first.right) returnArr.push(first.right)
    }
    if (first.left) queue.push(first.left)
    if (first.right) queue.push(first.right)
    return levelOrderRec(fn, null, queue, returnArr)
}

function preorder(fn, tree, returnArr = []) { // [left, root, right] better!
    if (fn) {
        fn(tree)
    } else {
        returnArr.push(tree)
    }
    if (tree.left) {
        preorder(fn, tree.left, returnArr)
    }
    if (tree.right) {
        preorder(fn, tree.right, returnArr)
    }
    if (!fn) return returnArr
}
/*
function preorder(fn, tree, stack = [tree], returnArr = []) { // [root, left, right]
    if (!fn && stack.length < 1) return returnArr
    if (stack.length < 1) return
    let last = stack.pop()
    if (fn) {
        fn(last)
    } else {
        returnArr.push(last)
    }
    if (last.right) stack.push(last.right)
    if (last.left) stack.push(last.left)
    return preorder(fn, null, stack, returnArr)
}*/


function inorder(fn, tree, returnArr = []) { // [left, root,  right]
    if (tree.left) {
        inorder(fn, tree.left, returnArr)
    }
    if (fn) {
        fn(tree)
    } else {
        returnArr.push(tree)
    }
    if (tree.right) {
        inorder(fn, tree.right, returnArr)
    }
    if (!fn) return returnArr
}

function postorder(fn, tree, returnArr = []) { // [left, right,  root]
    if (tree.left) {
        postorder(fn, tree.left, returnArr)
    }
    if (tree.right) {
        postorder(fn, tree.right, returnArr)
    }
    if (fn) {
        fn(tree)
    } else {
        returnArr.push(tree)
    }
    if (!fn) return returnArr
}

function height(tree, count = 0){
    if(!tree) return count
    count++
    return Math.max(height(tree.left, count), height(tree.right, count))
}

function depth(node, tree){
    let count = 0
    console.log(node.data, tree.data)
    while (tree && tree.data !== node.data) {
        if (node.data < tree.data) {
            tree = tree.left
        } else {
            tree = tree.right
        }
        count++
    }
    if (!tree) return null
    // found
    return count
}

function isBalanced(tree){
    let leftHeight = height(tree.left)
    let rightHeight = height(tree.right)
    console.log(leftHeight, rightHeight)
    if(Math.abs(leftHeight - rightHeight) < 2) return true
    return false
}

function rebalance(tree){
    if(isBalanced(tree.root)) return console.log('is balanced, no need')
    console.log('Not balanced, so working on it ....')
    let dataArr = levelOrder(null, tree.root).map(x => x.data)
    let newTree = new Tree()
    newTree.root = buildTree(dataArr)
    return newTree.root
}

function removeDuplicates(arr) {
    return [...new Set(arr)]
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
    // helper function to print binary search tree, by TOP team
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};


//test
// let tree = new Tree()
// tree.root = buildTree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324])
// prettyPrint(tree.root)

// insert(27, tree.root)
// insert(25, tree.root)
// insert(24, tree.root)
// insert(26, tree.root)
// insert(29, tree.root)
// insert(28, tree.root)
// insert(30, tree.root)
// prettyPrint(tree.root)

// deleteFromTree(8, tree.root)
// deleteFromTree(4, tree.root)
// deleteFromTree(3, tree.root)
// deleteFromTree(1, tree.root)
// deleteFromTree(7, tree.root)
// deleteFromTree(9, tree.root)
// prettyPrint(tree.root)

// console.log(find(23, tree.root))
// console.log(find(33, tree.root))

// let tmpFn = (x) => console.log(x.data)
// console.log(levelOrder(null, tree.root))
// console.log(levelOrderRec(null, tree.root))
// console.log(preorder(null, tree.root))
// console.log(inorder(null, tree.root))
// console.log(postorder(null, tree.root))

// insert(-1, tree.root)
// insert(-2, tree.root)
// insert(-3, tree.root)
// prettyPrint(tree.root)
// console.log(height(tree.root))

// let leaf = preorder(null, tree.root).slice(-1)[0]
// console.log(leaf)
// console.log(depth(leaf, tree.root))


// console.log(isBalanced(tree.root))
// insert(-2, tree.root)
// insert(-3, tree.root)
// prettyPrint(tree.root)
// console.log(isBalanced(tree.root))

// insert(-2, tree.root)
// insert(-3, tree.root)
// insert(-4, tree.root)
// insert(-5, tree.root)
// insert(-6, tree.root)
// prettyPrint(tree.root)
// let balancedTree = new Tree()
// balancedTree.root = rebalance(tree)
// prettyPrint(balancedTree.root)
// console.log(isBalanced(balancedTree.root))

// Tie it all together
let randArr = [...Array(Math.ceil(Math.random() * 10) + 14)].map(x => {
    return Math.ceil(Math.random() * 100 )
})
let TreeDemo = new Tree()
TreeDemo.root = buildTree(randArr)
prettyPrint(TreeDemo.root)
console.log(isBalanced(TreeDemo.root))
console.log(levelOrder(null, TreeDemo.root).map(x => x.data))
console.log(preorder(null, TreeDemo.root).map(x => x.data))
console.log(inorder(null, TreeDemo.root).map(x => x.data))
console.log(postorder(null, TreeDemo.root).map(x => x.data))
insert(155, TreeDemo.root)
insert(165, TreeDemo.root)
insert(125, TreeDemo.root)
insert(195, TreeDemo.root)
prettyPrint(TreeDemo.root)
console.log(isBalanced(TreeDemo.root))
TreeDemo.root = rebalance(TreeDemo)
prettyPrint(TreeDemo.root)
console.log(isBalanced(TreeDemo.root))
console.log(levelOrder(null, TreeDemo.root).map(x => x.data))
console.log(preorder(null, TreeDemo.root).map(x => x.data))
console.log(inorder(null, TreeDemo.root).map(x => x.data))
console.log(postorder(null, TreeDemo.root).map(x => x.data))


