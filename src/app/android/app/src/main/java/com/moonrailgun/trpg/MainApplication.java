package com.moonrailgun.trpg;

import android.app.Application;
import android.content.Context;
import com.facebook.react.ReactInstanceManager;
import java.lang.reflect.InvocationTargetException;

import com.facebook.react.ReactApplication;
import org.reactnative.camera.RNCameraPackage;
import org.wonday.pdf.RCTPdfView;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnfs.RNFSPackage;
import com.reactnativecommunity.cameraroll.CameraRollPackage;
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
import com.umeng.commonsdk.UMConfigure;
import com.umeng.soexample.invokenative.DplusReactPackage;
import com.umeng.soexample.invokenative.RNUMConfigure;
import com.umeng.message.PushAgent;
import com.umeng.message.IUmengRegisterCallback;
import org.android.agoo.xiaomi.MiPushRegistar;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

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
      // return Arrays.<ReactPackage>asList(
      //   new MainReactPackage(),
      //   new RNCameraPackage(),
      //   new RCTPdfView(),
      //   new RNFetchBlobPackage(),
      //   new RNFSPackage(),
      //   new CameraRollPackage(),
      //   new ReactNativeConfigPackage(),
      //   new DplusReactPackage(),
      //   new PickerPackage(),
      //   new FastImageViewPackage(),
      //   new RNCWebViewPackage(),
      //   new RNSentryPackage(),
      //   new CodePush(BuildConfig.CODEPUSH_DEPLOYMENTKEY, getApplicationContext(), BuildConfig.DEBUG, BuildConfig.CODEPUSH_URL),
      //   new RNGestureHandlerPackage(),
      //   new ImagePickerPackage(),
      //   new TRPGPackage()
      // );
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());
      return packages;
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

    // 注册友盟通用推送
    // 注意: 必须在此处注册
    PushAgent.getInstance(this).register(new IUmengRegisterCallback(){
        @Override
        public void onSuccess(String s) {
            Log.i("walle", "--->>> onSuccess, s is " + s);
        }

        @Override
        public void onFailure(String s, String s1) {
            Log.i("walle", "--->>> onFailure, s is " + s + ", s1 is " + s1);
        }
    });
    // 小米厂商通道
    MiPushRegistar.register(this, BuildConfig.UMENG_MIPUSH_APPID, BuildConfig.UMENG_MIPUSH_APPKEY);

    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.rndiffapp.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
}
