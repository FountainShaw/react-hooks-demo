## React Hooks的一些理解

### hooks的设计动机
`这里会着重说明一下组件的状态复用和React的设计原则问题`
  - #### 组件之间的状态逻辑复用比较困难
    - HOC 的主要作用是加强组件的功能，通过一个接受组件作为参数的函数输出一个新组件，以实现组件复用、渲染劫持或props的增删的效果。用它来实现代码的分层组合、或者插件注入都是非常合适的。
      - 这显然是一个更偏向于函数式的操作，而且有一定的实现门槛
      - 这一层包裹也使得组件中的数据来源变得不清晰，不好准确的去定位一些属性的来源
      ```javascript
        function withSubscription(WrappedComponent, selectData) {
          return class HocComponent extends React.Component {
            constructor(props) {
              super(props);
              this.state = {
                data: selectData(DataSource, props)
              };
            }
            // 一些通用的逻辑处理
            render() {
              // ... 并使用新数据渲染被包装的组件!
              return <WrappedComponent data={this.state.data} {...this.props} />;
            }
          };
        }
      ```

    - Render Props 的核心思想是，通过一个函数将class组件的state作为props传递给纯函数组件。作为JSX的一部分，可以很方便的用各种控制逻辑，比如if、for等，也足够简单直接。
      - 实际上有点类似于一个嵌套，但是如果嵌套一多，就很难受了，而且对于一些简单的操作，也需要嵌套一层JSX，有时显得很累赘
      - 渲染的传递也使得状态与控制操作的距离更远，不便于操作
      ```javascript
        class ComponentA extends React.Component {
          static propTypes = {
            render: PropTypes.func.isRequired
          }

          state = { x: 0, y: 0 }

          handleMouseMove = (event) => {
            this.setState({ x: event.clientX, y: event.clientY })
          }

          render() {
            return (
              <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
                {this.props.render(this.state)}
              </div>
            )
          }
        }

        <ComponentA
          render={({ a, b }) => (
            <span>{`${a}, ${b}`}</span>
          )}
        />
      ```

      - hooks是对HOC和Render Props方案的一些补充
        - 擅长做一些高内聚或者控制性很强的事情。
        - 特别是对于状态逻辑的复用，更清晰简洁，而且也便于定位数据的来源。
        ```javascript
          const { x, y } = useMouse();
          const { x: pageX, y: pageY } = usePage();
          
          useEffect(() => {
          
          }, [pageX, pageY]);
        ```

  - #### 复杂组件变的难以理解
    主要体现在生命周期中会维护很多逻辑，而且有可能相关性不大，这就导致组件过大时，逻辑难以理解
  - #### 类组件有一些需要努力理解的问题
    比如this，以及事件绑定
  - #### 能让React的内核与实现更贴合
    React从精神原则上来说是函数式的，hooks也是拥抱函数式编程的，这使得react从内核到实现再到应用都形成了一个统一的整体

    - 为什么说React从精神原则上来说是函数式的
      - react是一个状态机
      - 类似于 `f(state) = UI` 这样一个表达式
      - 以状态为自变量，UI为因变量，用声明式的编程方式来实现功能
    - 函数式有什么好处
      - 将`是什么`与`做什么`分开，让我们更专注于正在完成的事情
      - 只输出确定性的结果，便于调试与预测
      - 在数据计算方面有着天然的优势
    - React不是函数式的
      - js语言本身就不是函数式的
      - react的类组件明显是面向对象的
      - react中副作用并没有被完全剥离，输出的结果也并不都是确定的
    - hooks使得React往函数式更进一步
      - hooks要求剥离副作用
      - hooks对执行顺序要求严格，更偏向于得到确定的结果
      - hooks鼓励将组件拆分成更小的粒度，便于专注于问题的解决和功能的复用
### 关于代数效应
  - #### 什么是代数效应
    代数效应是一种计算效应的方法，它源于操作的不纯性，例如I/O、异常处理等。这当然需要一段程序来处理它，不仅是异常处理，也可能包含流重定向、回溯、协作多线程和定界延续等。
  - #### 讲hooks为什么要先讲代数效应
  - #### hooks对代数效应的践行

### hooks的简单实现
