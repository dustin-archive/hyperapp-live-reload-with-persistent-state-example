const { h, app } = require('hyperapp')
const persist = require('hyperapp-persist')()

const store = () => ({
  state: {
    value: [0, 0, 0]
  },
  actions: {
    reset: state => {
      state.value = [0, 0, 0]
      return state
    },
    add: (state, actions, data) => {
      state.value[data] = state.value[data] + 1
      return state
    },
    sub: (state, actions, data) => {
      state.value[data] = state.value[data] - 1
      return state
    },
    append: (state, actions) => {
      state.value[state.value.length] = 0
      return state
    },
    remove: (state, actions, data) => {
      state.value.splice(data, 1)
      return state
    }
  }
})

const counter = (state, actions, data) => {
  return h('div', { class: 'row' }, [
    h('button', { onclick: () => { actions.remove(data) } }, 'remove'),
    h('button', { onclick: () => { actions.sub(data) } }, '-'),
    h('button', { onclick: () => { actions.add(data) } }, '+'),
    h('div', null, `Counter: ${state.value[data]}`)
  ])
}

const list = (state, actions) => {
  let result = []
  for (let i = 0, l = state.value.length; i < l; i++) {
    result[i] = counter(state, actions, i)
  }
  return result
}

app({
  mixins: [persist, store],
  actions: {
    restorePreviousState: state => state.previous
  },
  events: {
    loaded: (state, actions) => {
      if (state.previous) {
        actions.restorePreviousState()
      }
    }
  },
  view: (state, actions) => h('div', null, [
    h('button', { onclick: actions.append }, 'append'),
    h('button', { onclick: actions.reset }, 'reset'),
    h('div', null, list(state, actions))
  ])
})
