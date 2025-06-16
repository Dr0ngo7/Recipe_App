import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import {
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase';

export default function ProfileScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Çıkış Hatası', error.message);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      Alert.alert('Başarılı', 'Şifre güncellendi.');
      setCurrentPassword('');
      setNewPassword('');
      setChangingPassword(false);
    } catch (error) {
      Alert.alert('Şifre Değiştirme Hatası', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/header-pattern.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>👤 Profil</Text>
        <Text style={styles.email}>📧 {user.email}</Text>

        {changingPassword ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Mevcut Şifre"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Yeni Şifre"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Şifreyi Güncelle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChangingPassword(false)}>
              <Text style={styles.link}>İptal</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={() => setChangingPassword(true)}>
              <Text style={styles.buttonText}>Şifre Değiştir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
              <Text style={styles.buttonText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
     backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#2d3436'
  },
  email: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#0984e3',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  logoutButton: {
    backgroundColor: '#d63031',
    marginTop: 12
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 14
  },
   overlay: {
    flex: 1,
    width: '100%',
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.30)', // 👈 transparan beyaz katman
    justifyContent: 'center'
  },
});
