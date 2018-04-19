import request from '../utils/request';

export function query({page=1}) {
  return request(`/users?_page=${page}&_limit=5`);
}
