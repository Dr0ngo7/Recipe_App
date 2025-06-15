import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
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
      console.error(error);
      Alert.alert('Şifre Değiştirme Hatası', error.message);
    }
  };

  return (
    <View style={styles.container}>
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
          <Button title="Şifreyi Güncelle" onPress={handleChangePassword} />
          <TouchableOpacity onPress={() => setChangingPassword(false)}>
            <Text style={styles.link}>İptal</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Button title="Şifre Değiştir" onPress={() => setChangingPassword(true)} />
          <View style={{ height: 12 }} />
          <Button title="Çıkış Yap" onPress={handleLogout} color="#ff3b30" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  },
  email: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 12
  }
});
