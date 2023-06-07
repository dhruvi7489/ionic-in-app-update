
------------ Generate Keystore
keytool -genkey -v -keystore hour4u-app-release-key.keystore -alias hour4u -keyalg RSA -keysize 2048 -validity 10000
keytool -list -v -keystore hour4u-app-release-key.keystore


------------ Build Signed Android APK 
ionic build
ionic cap sync android
cd ./android
gradlew assemble
cd ..
New keystore = jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore hour4u-app-release-key.keystore ./android/app/build/outputs/apk/release/app-release-unsigned.apk hour4u (currently we are not using this)
Old keystore = jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore hour4u-keystore.jsk ./android/app/build/outputs/apk/release/app-release-unsigned.apk hour4u
pwd: hour4u

#Option1 

1. 
ionic cap open android
build signin app with hour4u-app-release-key.keystore
keystore pwd: hour4u 
alias : hour4u

2.
build signin app with hour4u-keystore.jsk
keystore pwd: hour4u 
alias : hour4u

#Option2
zipalign -v 4 ./android/app/build/outputs/apk/release/app-release-unsigned.apk hour4u.apk



------------ Build IOS APK 
 Also follow this doc : https://capacitorjs.com/docs/ios
ionic build
npx cap sync ios
npx cap open ios



------------ Check key value from keystore file

keytool -list -v -keystore hour4u-keystore.jsk



-------------------- Resources geneerate for IOS & ANDROID
$ cordova-res ios --skip-config --copy
$ cordova-res android --skip-config --copy

npx capacitor-assets generate // Add to ANDROID & IOS & PWA folder