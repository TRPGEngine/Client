import { initMiniStar, regDependency, regSharedModule } from 'mini-star';

/**
 * 初始化插件
 */
export function initPlugins() {
  initMiniStar({
    plugins: [
      {
        name: 'trpg',
        url: '/plugins/trpg/index.js',
      },
    ],
  });

  // Dependency
  regDependency('react', () => import('react'));
  regDependency('react-redux', () => import('react-redux'));
  regDependency('react-use', () => import('react-use')); // TODO: Not good
  regDependency('react-router', () => import('react-router'));
  regDependency('react-router-dom', () => import('react-router-dom'));
  regDependency('styled-components', () => import('styled-components'));
  regDependency('@ant-design/icons', () => import('@ant-design/icons')); // TODO: Not good
  regDependency('immer', () => import('immer'));
  regDependency('antd', () => import('antd')); // TODO: Not good
  regDependency('lodash/get', () => import('lodash/get'));
  regDependency('lodash/set', () => import('lodash/set'));
  regDependency('lodash/remove', () => import('lodash/remove'));
  regDependency('lodash/find', () => import('lodash/find'));
  regDependency('lodash/isNil', () => import('lodash/isNil'));
  regDependency('lodash/isEmpty', () => import('lodash/isEmpty'));
  regDependency('lodash/isUndefined', () => import('lodash/isUndefined'));
  regDependency('lodash/isString', () => import('lodash/isString'));
  regDependency('lodash/isFunction', () => import('lodash/isFunction'));
  regDependency('lodash/clone', () => import('lodash/clone'));
  regDependency('lodash/cloneDeep', () => import('lodash/cloneDeep'));
  regDependency('lodash/uniq', () => import('lodash/uniq'));
  regDependency('lodash/keyBy', () => import('lodash/keyBy'));

  // Web
  regSharedModule(
    '@capital/web/routes/Main/Content/SidebarItem',
    () => import('@web/routes/Main/Content/SidebarItem')
  );
  regSharedModule(
    '@capital/web/reg/regPersonalPanel',
    () => import('@web/reg/regPersonalPanel')
  );
  regSharedModule(
    '@capital/web/reg/regGroupInfoMenu',
    () => import('@web/reg/regGroupInfoMenu')
  );
  regSharedModule(
    '@capital/web/reg/regMessageCard',
    () => import('@web/reg/regMessageCard')
  );
  regSharedModule(
    '@capital/web/reg/regMsgSenderPopover',
    () => import('@web/reg/regMsgSenderPopover')
  );
  regSharedModule(
    '@capital/web/components/TLoadable',
    () => import('@web/components/TLoadable')
  );
  regSharedModule(
    '@capital/web/components/Iconfont',
    () => import('@web/components/Iconfont')
  );
  regSharedModule(
    '@capital/web/components/PillTabs',
    () => import('@web/components/PillTabs')
  );
  regSharedModule(
    '@capital/web/components/StandaloneWindow',
    () => import('@web/components/StandaloneWindow')
  );
  regSharedModule(
    '@capital/web/components/Modal',
    () => import('@web/components/Modal')
  );
  regSharedModule(
    '@capital/web/components/ModalPanel',
    () => import('@web/components/ModalPanel')
  );
  regSharedModule(
    '@capital/web/components/AddonMore',
    () => import('@web/components/AddonMore')
  );
  regSharedModule(
    '@capital/web/components/LoadingSpinner',
    () => import('@web/components/LoadingSpinner')
  );
  regSharedModule(
    '@capital/web/components/TemplateItem',
    () => import('@web/components/TemplateItem')
  );
  regSharedModule(
    '@capital/web/components/Avatar',
    () => import('@web/components/Avatar')
  );
  regSharedModule(
    '@capital/web/components/messageTypes/card/BaseCard',
    () => import('@web/components/messageTypes/card/BaseCard')
  );
  regSharedModule(
    '@capital/web/components/popover/index',
    () => import('@web/components/popover/index')
  );
  regSharedModule(
    '@capital/web/utils/upload-helper',
    () => import('@web/utils/upload-helper')
  );
  regSharedModule(
    '@capital/web/utils/file-helper',
    () => import('@web/utils/file-helper')
  );
  regSharedModule('@capital/web/utils/error', () => import('@web/utils/error'));

  // Shared
  regSharedModule(
    '@capital/shared/project.config',
    () => import('@shared/project.config')
  );
  regSharedModule('@capital/shared/i18n', () => import('@shared/i18n'));
  regSharedModule(
    '@capital/shared/api/trpg.api',
    () => import('@shared/api/trpg.api')
  );
  regSharedModule(
    '@capital/shared/api/rn-storage.api',
    () => import('@shared/api/rn-storage.api')
  );
  regSharedModule(
    '@capital/shared/components/TMemo',
    () => import('@shared/components/TMemo')
  );
  regSharedModule(
    '@capital/shared/components/bbcode/serialize',
    () => import('@shared/components/bbcode/serialize')
  );
  regSharedModule(
    '@capital/shared/manager/ui',
    () => import('@shared/manager/ui')
  );
  regSharedModule('@capital/shared/manager/userState', () =>
    import('@shared/manager/userState').then((module) => ({
      subscribeToUserLoginSuccess: module.subscribeToUserLoginSuccess,
      subscribeToUserLogoutSuccess: module.subscribeToUserLogoutSuccess,
    }))
  );
  regSharedModule(
    '@capital/shared/context/GroupInfoContext',
    () => import('@shared/context/GroupInfoContext')
  );
  regSharedModule(
    '@capital/shared/utils/uuid',
    () => import('@shared/utils/uuid')
  );
  regSharedModule(
    '@capital/shared/utils/cache-helper',
    () => import('@shared/utils/cache-helper')
  );
  regSharedModule(
    '@capital/shared/utils/file-helper',
    () => import('@shared/utils/file-helper')
  );
  regSharedModule(
    '@capital/shared/utils/data-helper',
    () => import('@shared/utils/data-helper')
  );
  regSharedModule(
    '@capital/shared/utils/msg-helper',
    () => import('@shared/utils/msg-helper')
  );
  regSharedModule(
    '@capital/shared/components/layout/XMLBuilder',
    () => import('@shared/components/layout/XMLBuilder')
  );
  regSharedModule(
    '@capital/shared/redux/configureStore/helper',
    () => import('@shared/redux/configureStore/helper')
  );
  regSharedModule(
    '@capital/shared/redux/hooks/useTRPGSelector',
    () => import('@shared/redux/hooks/useTRPGSelector')
  );
  regSharedModule(
    '@capital/shared/redux/hooks/useCache',
    () => import('@shared/redux/hooks/useCache')
  );
  regSharedModule(
    '@capital/shared/redux/hooks/group',
    () => import('@shared/redux/hooks/group')
  );
  regSharedModule(
    '@capital/shared/utils/string-helper',
    () => import('@shared/utils/string-helper')
  );
  regSharedModule(
    '@capital/shared/utils/upload-helper',
    () => import('@shared/utils/upload-helper')
  );
  regSharedModule(
    '@capital/shared/model/player',
    () => import('@shared/model/player')
  );
  regSharedModule(
    '@capital/shared/model/group',
    () => import('@shared/model/group')
  );

  // Not good to share
  regSharedModule(
    '@capital/shared/redux/actions/ui',
    () => import('@shared/redux/actions/ui')
  );
  regSharedModule(
    '@capital/shared/redux/actions/group',
    () => import('@shared/redux/actions/group')
  );
  regSharedModule(
    '@capital/shared/model/actor',
    () => import('@shared/model/actor')
  );
  regSharedModule(
    '@capital/shared/model/trpg',
    () => import('@shared/model/trpg')
  );
}
