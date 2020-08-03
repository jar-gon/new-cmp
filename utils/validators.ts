import { ValidatorFn } from '@billyunq/react-utils/form'

export const mobile = /^1[^1269]\d{9}$/

export const email = /^[a-z0-9]([a-z0-9.-_]*[a-z0-9])?@([a-z0-9]([a-z0-9-_]*[a-z0-9])?\.){1,}[a-z]+$/i

export function password(slash = true): ValidatorFn<string> {
  // eslint-disable-next-line no-useless-escape
  const symbol = slash ? /[()`~!@#$%^&*\-_+=|{}\[\]:;'<>,.?/]/ : /[()`~!@#$%^&*\-_+=|{}\[\]:;'<>,.?]/
  return function (rule, value, callback) {
    const count = [ /[a-z]/, /[A-Z]/, /\d/, symbol ].map(x => x.test(value)).filter(x => x).length
    const low = count <= 2 || value.length < 8
    const high = count >= 4 && value.length >= 8
    const medium = !low && !high
    if ((medium || high) && value.length < 32) {
      callback()
    } else {
      callback(rule.message)
    }
  }
}

export function required(getter: (value: unknown) => unknown): ValidatorFn<unknown> {
  return function (rule, value, callback) {
    if (![ undefined, null ].includes(getter(value))) {
      callback()
    } else {
      callback(rule.message)
    }
  }
}
