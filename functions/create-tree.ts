interface TreeNode {
  value: number;
  child: TreeNode | null;
}

const createTree = (n: number): TreeNode | null => {
  if (n <= 0) return null;
  return { value: n, child: createTree(n - 1) };
};

// console.log(createTree(3));
