/***
 * 数据模型
 */

import Api from '../config/api';


/***
 * 数组数据构建数据模型
 * @param data
 * @param keys
 * @returns {Array}
 * @constructor
 */
function ArrayDataToModel(data,keys){
  if(data === null)return data;
  let models = [];
  Array.isArray(data) && data.forEach(item => {
    models.push(ObjectDataToModel(item,keys));
  });
  return models;
}

/***
 * 对象数据构建数据模型
 * @param data
 * @param keys
 * @returns {{}}
 */
function ObjectDataToModel(data,keys){
  if(data === null)return data;
  let model = {};
  for(let index in keys){
    if(typeof keys[index] === 'object'){
      if(Array.isArray(data[keys[index].key])){
        model[index] = ArrayDataToModel(data[keys[index].key],keys[index].keys);
      }else if(typeof data[keys[index].key] === 'object'){
        model[index] = ObjectDataToModel(data[keys[index].key],keys[index].keys);
      }
    }else{
      model[index] = data[keys[index]];
    }
  }
  return model;
}


export default (api,data) => {
  const Model = {
    [Api.login]: data => {
      const keys = {
        token: 'token'
      };
      return ObjectDataToModel(data,keys);
    },
    [Api.getKnowledgeTypes]: data => {
      const keys = {
        name: 'name',
        icon: 'icon',
        iconHover: 'selectedIcon',
        id: 'id',
        children: {
          key: 'children',
          keys: {
            name: 'name',
            children: 'children',
            id: 'id'
          }
        }
      };

      return ArrayDataToModel(data,keys);
    },
  };
  return Model[api](data);
};

