import _ from 'lodash'

const getContractMethodValue = (contract, methodName, dataKey) => (
  contract && dataKey && _.get(contract, `${methodName}.${dataKey}.value`)
)

export default getContractMethodValue
