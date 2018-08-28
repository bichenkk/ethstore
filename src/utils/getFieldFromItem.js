// turn item with specific keys to a field object for antd form
export default (item = {}, keys = []) => (
  keys.reduce((prev, key) => ({
    ...prev,
    ...{ [key]: { name: key, value: item[key] } },
  }), {})
)
