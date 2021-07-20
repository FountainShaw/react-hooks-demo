function App() {
  const [count, setCount] = useState(0);

  console.log(`count: ${count}`);

  return {
    click() {
      setCount(n => n + 1);
    }
  };
}

const fiber = {
  stateNode: App,
  memoizedState: null
};

let workInProgressHook;
let isMount = true;

function schedule() {
  workInProgressHook = fiber.memoizedState;
  const app = fiber.stateNode();
  isMount = false;

  return app;
}

window.app = schedule()

function useState(initialState) {
  let hook;

  if (isMount) {
    hook = {
      memoizedState: initialState,
      queue: {
        pending: null
      },
      next: null
    };

    if (!fiber.memoizedState) {
      // fiber中链表第一项指向第一个初始化的hook
      fiber.memoizedState = hook;
    } else {
      // 之后的hook通过链表的next指向串起来，将前一个hook的next指向当前hook
      workInProgressHook.next = hook;
    }
    // 改变当前工作hook的指向
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;

    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending);

    hook.queue.pending = null;
  }

  hook.memoizedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)];
}

function dispatchAction(queue, action) {
  const update = {
    action,
    next: null
  };

  // a0 --> a1 --> a2 --> a3 (pending) --> a0
  if (!queue.pending) {
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }

  queue.pending = update;

  schedule();
}
