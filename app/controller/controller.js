const { bodySchema } = require('../validation/validation')

function doValidation (input) {
  const { rule, data } = input
  if (!input.hasOwnProperty('rule')) {
    throw new Error('rule field is required')
  }
  
  if (!input.hasOwnProperty('data')) {
    throw new Error('data field is required')
  }
  
  const { field, condition, condition_value } = rule
  
  const fieldChunk = field.split('.')
  
  let traversal = data
  let _data = {
    validation: {
      error: true,
      ...rule
    }
  }
  let message = ''
  let error = false
  for (let i = 0; i < fieldChunk.length; i++) {
    const chunk = fieldChunk[i]
    if (!traversal.hasOwnProperty(chunk)) {
      error = true
      message = `field ${ field } is missing from data.`
      _data = null
      break
    }
    traversal = traversal[chunk]
  }
  
  if (!error) {
    _data['validation']['field_value'] = traversal
    switch (condition) {
      case 'gte':
        if (traversal >= condition_value) {
          error = false
          message = `field ${ field } successfully validated.`
        } else {
          error = true
          message = `field ${ field } failed validation.`
        }
        break
      case 'gt':
        if (traversal > condition_value) {
          error = false
          message = `field ${ field } successfully validated.`
        } else {
          error = true
          message = `field ${ field } failed validation.`
        }
        break
      case 'neq':
        if (traversal !== condition_value) {
          error = false
          message = `field ${ field } successfully validated.`
        } else {
          error = true
          message = `field ${ field } failed validation.`
        }
        break
      case 'eq':
        if (traversal === condition_value) {
          error = false
          message = `field ${ field } successfully validated.`
        } else {
          error = true
          message = `field ${ field } failed validation.`
        }
        break
      case 'contains':
      default:
        if (traversal.match(/condition_value/igm)) {
          error = false
          message = `field ${ field } successfully validated.`
        } else {
          error = true
          message = `field ${ field } failed validation.`
        }
    }
    _data['validation']['error'] = error
  }
  
  return {
    message,
    status: error ? "error" : "success",
    data: _data
  }
}
module.exports = {

  async isValidJSON(text){
    try{
        JSON.parse(text);
        return true;
    }
    catch (error){
        return false;
    }
}, 

  async validateRule(req, res) {
    // const test = {
    //   "rule": {
    //     "field": 7,
    //     "condition": "contains",
    //     "condition_value": "rocinante"
    //   },
    //   "data": ["The Nauvoo", "The Razorback", "The Roci", "Tycho"]
    // }
    try {
      const isValid = await this.isValidJSON(JSON.stringify(req.body))
      console.log('isValid', isValid);

      if (isValid === false) {
        return res.send({
          "message": "Invalid JSON payload passed.",
          "status": "error",
            "data": null
        })
      }

      await bodySchema.validateAsync(req.body);

      const value = await doValidation(req.body)
      return res.status(value.status === 'error' ? 400 : 200 ).send({
        ...value
      })
    } catch (error) {
      console.log('error', error.details[0]);
      res.status(400).send({
          message: `${error.details[0].message.replace(/['"]+/g, '')}.`,
          status: "error",
          data: null
      })
    }
  }
}