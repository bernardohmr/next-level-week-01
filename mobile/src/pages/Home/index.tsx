import React, { useEffect, useState, ChangeEvent } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { View, Image, StyleSheet, Text, ImageBackground, Platform } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import axios from "axios";

interface IbgeUfResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [uf, setUf] = useState("0");
  const [city, setCity] = useState("0");

  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IbgeUfResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then((response) => {
        setUfs(response.data.map(el => el.sigla));
      });
  }, []);

  useEffect(() => {
    if (uf === "0") {
      return;
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`).then((response) => {
      const ibgeCities = response.data.map(uf => uf.nome);
      setCities(ibgeCities);
    });
  }, [uf]);

  function handleSelectUf(uf: string) {
    setUf(uf);
  }

  function handleSelectCity(city: string) {
    setCity(city);
  }

  function handleNavigateToPoints() {
    navigation.navigate("Points", {
      uf,
      city,
    });
  }

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu Marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          placeholder={{ label: "Selecione seu estado", value: null }}
          style={styles}
          onValueChange={(value) => handleSelectUf(value)}
          items={ufs.map(el => ({ label: el, value: el}))}
        />
        <RNPickerSelect
          placeholder={{ label: "Selecione sua cidade", value: null }}
          style={styles}
          onValueChange={(value) => handleSelectCity(value)}
          items={cities.map(el => ({ label: el, value: el}))}
        />
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>

    </ImageBackground>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  inputIOS: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    paddingRight: 30, // to ensure the text is never behind the icon
  },

  inputAndroid: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    paddingRight: 30, // to ensure the text is never behind the icon
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;
