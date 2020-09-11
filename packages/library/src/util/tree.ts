
import { isArray, cloneDeep } from 'lodash'
import { Component } from '../core'

export const traverse = (root: any, callback: any) => {
  callback(root)

  // Retrieve metadata from component
  const { metadata } = Object.getPrototypeOf(root).constructor

  if (metadata.nestedComponents) {
    // Retrieve nested components form associated options
    metadata.nestedComponents.forEach((o: any) => {
      const nested = root.options[o]

      if (isArray(nested)) {
        // Traverse array of nested components
        nested.map((c: any) => traverse(c, callback))
      } else if (nested instanceof Component) {
        // Traverse components directly
        traverse(nested, callback)
      }
    })
  }
}

export const reduce = (root: any, callback: any, initialValue: any) => {
  let accumulator = cloneDeep(initialValue)

  // Traverse tree, while updating
  // the initial value throughout
  traverse(
    root,
    (current: any) => (accumulator = callback(accumulator, current)),
  )

  return accumulator
}

export const aggregateParentOption = (leaf: any, option: any) =>
  
  Object.assign(
    {},
    ...leaf.parents.map((o: any) => o.options[option] || {}),
    leaf.options[option],
  )