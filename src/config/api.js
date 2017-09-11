/***
 * API接口名集合
 */

let api = {//无域名的接口,相对路径
  getKnowledgeTypes: 'knowledge/getKnowledgeTypes.do',
  getKnowledgeList: 'knowledge/getKnowledgeList.do',
  login: 'user/userLogin.do',
  getUserInfo: 'user/userInfo.do',
  updatePassword: 'user/updatePwd.do',
  uploadHeadImage: 'user/uploadHeadImage.do',
  getKnowledgeDetail: 'knowledge/getKnowledgeDetail.do',
  getKnowledgeClassList: 'knowledge/getKnowledgeClassList.do',
  getStudyNote: 'knowledge/getStudyNote.do',
  praise: 'knowledge/praise.do',
  recordStudy: 'knowledge/recordStudyLength.do',
  getKnowledgeClassUrl: 'knowledge/getKnowledgeClassUrl.do',
  search: 'knowledge/globalSearch.do',
  getStudyNoteList: 'user/getStudyNoteList.do',
  getRankList: 'user/getRankList.do',
  getStudyList: 'user/getStudyList.do',
  joinLearning: 'user/joinLearning.do',
  addStudyNote: 'user/addStudyNote.do',
  editStudyNote: 'user/editStudyNote.do',
  hideUserKnowledge: 'user/hideUserKnowledge.do'
};


export default api;
