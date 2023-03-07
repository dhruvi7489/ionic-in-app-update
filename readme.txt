
------------ Generate Keystore
keytool -genkey -v -keystore hour4u-app-release-key.keystore -alias hour4u -keyalg RSA -keysize 2048 -validity 10000
keytool -list -v -keystore hour4u-app-release-key.keystore


------------ Build Signed Android APK 
ionic build
ionic cap sync android
cd ./android
gradlew assemble
cd ..
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore hour4u-app-release-key.keystore ./android/app/build/outputs/apk/release/app-release-unsigned.apk hour4u
pwd: hour4u
#Option1 
ionic cap open android
build signin app with hour4u-app-release-key.keystore
keystore pwd: hour4u 
alias : hour4u
#Option2
zipalign -v 4 ./android/app/build/outputs/apk/release/app-release-unsigned.apk hour4u.apk


------------ Build IOS APK 
ionic Build
npx cap sync ios
npx cap open ios