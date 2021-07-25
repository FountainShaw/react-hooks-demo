/**
        定义一个获取总数量的函数，每一个id对应着不同的人，不同的人又有不同的数量。
        如果说这个getNum函数是个纯函数，则我们的问题就没有什么讨论下去的必要了。
        当getNum是一个异步函数，比如从远端接口获取一个结果。
        此时这种写法就存在比较大的问题了，getTotalNum并不能按照预期得到我们想要的结果。
        当然，我们可以通过很简单的办法来处理一下，也就是async、await。
        但是这又引起了另一个问题，所有调用这个方法的函数都会被传染，也就是你要在他外面加一个async。
        这是我们不希望看到的，特别是在函数嵌套调用层级很深的时候。
        我们还有其他简单的处理办法么，暂时是没有的。
        所以我们可以暂时创造一种语法，用来描述这个事情实现之后的效果，比如try...handle
 */
function TotalNum({ id1, id2 }) {
  const num1 = useNum(id1);
  const num2 = useNum(id2);

  return num1 + num2;
}

function useNum(id) {
  const [num, setNum] = useState(id);

  useEffect(() => {
    fetch(`https://www.example.com?id=${id}`)
      .then(res => res.json())
      .then(({ num }) => {
        setNum(num);
      });
  }, [id]);

  return num;
}

/**
 * 我们说的这种try...handle的方式，通过将副作用从我们要做的事情中分离出来
 * 并且不用关注他里面同步或异步的问题
 * 这样基本就是一种代数式的方式来处理一些效应了
 * 但是这和hooks有啥关系呢
 */
// try {
//         getTotalNum(1, 2)
// } handle (id) {
//         fetch(`https://www.example.com?id=${id}`)
//                 .then(res => res.json())
//                 .then(({ num }) => {
//                         resume num
//                 })
// }

/**
 * 在正常的程序流程中，允许我们停下来，去做另外一件事，
 * 做完之后，我们可以再从被打断的地方继续往下执行，
 * 而另外的那件事，可以是同步的，也可以是异步的，
 * 理论上，它的执行过程与我们当前的流程无关，我们仅关心它的结果。
 */
