package com.moonrailgun.trpg;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import io.sentry.RNSentryPackage;
import com.microsoft.codepush.react.CodePush;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import cn.jpush.reactnativejpush.JPushPackage;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.soexample.invokenative.DplusReactPackage;
import com.umeng.soexample.invokenative.RNUMConfigure;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  // 设置为 true 将不会弹出 toast
  private boolean SHUTDOWN_TOAST = true;
  // 设置为 true 将不会打印 log
  private boolean SHUTDOWN_LOG = false;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new ReactNativeConfigPackage(),
        new PickerPackage(),
        new FastImageViewPackage(),
        new RNCWebViewPackage(),
        new RNSentryPackage(),
        new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG, getResources().getString(R.string.reactNativeCodePush_androidServerUrl)),
        new RNGestureHandlerPackage(),
        new ImagePickerPackage(),
        new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
        new DplusReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    RNUMConfigure.init(this, BuildConfig.UMENG_PUSH_APPKEY, BuildConfig.UMENG_PUSH_CHANNEL, UMConfigure.DEVICE_TYPE_PHONE,
            BuildConfig.UMENG_PUSH_MESSAGESECRET);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
