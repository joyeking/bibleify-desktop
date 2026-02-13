import Realm from 'realm';
import { app } from '@electron/remote';
import PassageSchema from '../constants/PassageSchema';

export function getBibleRealmPath(version) {
  return `${app.getAppPath()}/${version}.realm`;
}

export function openBibleRealm(version) {
  return Realm.open({
    schema: [PassageSchema],
    readOnly: true,
    path: getBibleRealmPath(version),
  });
}

export function getAnnotationRealmPath() {
  return `${app.getPath('userData')}/annotations.realm`;
}

export default Realm;
