const Joi = require('joi');

const rule = Joi.object({
  field: Joi.string().required().messages({
    "string.base": `field should be a String`,
    "any.required": `field is required`
  }),
  condition: Joi.string().messages({
    "string.base": `condition should be a String`,
    "any.required": `condition is required`
  }),
  condition_value: Joi.any().required().messages({
    "any.required": `condition value is required`
  }),
}).required().messages({
  "object.base": `rule should be an object`,
  "any.required": `rule is required`
});

const data = Joi.any().required().messages({
  "any.required": `data is required`
});;

module.exports = {
    bodySchema: Joi.object({
      rule,
      data,
    })
};
