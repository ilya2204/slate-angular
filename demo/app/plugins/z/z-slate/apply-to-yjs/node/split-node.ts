import { SplitNodeOperation } from 'slate';
import { SharedType, SyncNode } from '../../model';
import { getParent } from '../../path';
import cloneSyncElement from '../../utils/clone';

/**
 * Applies a split node operation to a SharedType
 *
 * @param doc
 * @param op
 */
export default function splitNode(
  doc: SharedType,
  op: SplitNodeOperation
): SharedType {
  const [parent, index]: [SyncNode, number] = getParent(doc, op.path);

  const children = SyncNode.getChildren(parent);

  const target = children.get(index);
  const inject = cloneSyncElement(target);
  children.insert(index + 1, [inject]);

  Object.entries(op.properties).forEach(([key, value]) =>
    inject.set(key, value)
  );

  if (SyncNode.getText(target) !== undefined) {
    const targetText = SyncNode.getText(target);
    const injectText = SyncNode.getText(inject);

    if (targetText.length > op.position) {
      targetText.delete(op.position, targetText.length - op.position);
    }

    if (injectText !== undefined && op.position !== undefined) {
      injectText.delete(0, op.position);
    }
  } else {
    const targetChildren = SyncNode.getChildren(target);
    const injectChildren = SyncNode.getChildren(inject);

    targetChildren.delete(op.position, targetChildren.length - op.position);

    if (op.position !== undefined) {
      injectChildren.delete(0, op.position);
    }
  }

  return doc;
}
