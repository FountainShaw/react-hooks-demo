function App() {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(0);

  console.log(`count is : ${count}`);
  console.log(`num is : ${num}`);

  return {
    click() {
      setCount(n => n + 1);
      setCount(n => n * 10);

      setNum(n => n + 3);
      setNum(n => n * 3);
    }
  };
}

const fiber = {
  stateNode: App,
  memorizedState: null
};

let workInProgressHook;
let isMount = true;

function schedule() {
  workInProgressHook = fiber.memorizedState;

  const app = fiber.stateNode();
  isMount = false;

  return app;
}

function useState(initialState) {
  let hook;

  if (isMount) {
    hook = {
      memorizedState: initialState,
      next: null,
      queue: {
        pending: null
      }
    };

    if (!fiber.memorizedState) {
      fiber.memorizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }

    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  let baseState = hook.memorizedState;
  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;

    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending);

    hook.queue.pending = null;
  }
  hook.memorizedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)];
}

function dispatchAction(queue, action) {
  const update = {
    action,
    next: null
  };

  if (!queue.pending) {
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }

  queue.pending = update;

  schedule();
}

window.app = schedule();
