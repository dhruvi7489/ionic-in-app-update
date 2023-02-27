
------------ Generate Keystore
keytool -genkey -v -keystore hour4u-app-release-key.keystore -alias hour4u -keyalg RSA -keysize 2048 -validity 10000
keytool -list -v -keystore hour4u-app-release-key.keystore


------------ Build Signed APK
cd ./android
gradlew assemble
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore hour4u-app-release-key.keystore ./android/app/build/outputs/apk/release/app-release-unsigned.apk hour4u
zipalign -v 4 ./android/app/build/outputs/apk/release/app-release-unsigned.apk hour4u.apk