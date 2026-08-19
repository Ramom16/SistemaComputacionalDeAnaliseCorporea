import React, { useRef, useState } from 'react';

import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    type: 'hero',
    title: 'TREINOS\nPERSONALIZADOS\nPARA VOCÊ',
    description:
      'Uma plataforma criada para ajudar você a entender seu corpo e evoluir nos seus treinos.',
  },

  {
    id: '2',
    title: 'COMO\nFUNCIONA?',
    description:
      'Você informa seus dados corporais, seu nível de atividade e seus objetivos. O sistema utiliza essas informações para construir uma análise personalizada.',
  },

  {
    id: '3',
    title: 'ANÁLISE\nMETABÓLICA',
    description:
      'O sistema calcula indicadores como IMC, TMB e NDC para ajudar você a compreender melhor suas necessidades corporais e energéticas.',
  },

  {
    id: '4',
    title: 'TREINOS\nPERSONALIZADOS',
    description:
      'A partir dos seus dados e objetivos, o sistema poderá recomendar exercícios e treinos adequados ao seu perfil.',
  },

  {
    id: '5',
    title: 'ACOMPANHE\nSUA EVOLUÇÃO',
    description:
      'Registre seus dados ao longo do tempo e acompanhe suas mudanças corporais e sua evolução dentro da plataforma.',
  },

  {
    id: '6',
    type: 'action',
    title: 'PRONTO\nPARA COMEÇAR?',
    description:
      'Crie sua conta e comece a acompanhar seus treinos, seus indicadores e sua evolução.',
  },
];

export default function LandingPage({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef = useRef(null);

  function handleScroll(event) {
    const offsetX = event.nativeEvent.contentOffset.x;

    const index = Math.round(offsetX / width);

    setCurrentIndex(index);
  }

  function goToNext() {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  }

  function goToPrevious() {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  }

  function renderSlide({ item, index }) {
    const isLast = index === slides.length - 1;

    return (
      <View style={styles.slide}>

        {/* Logo */}
        <View style={styles.topBar}>
          <Text style={styles.logo}>
            IRON<Text style={styles.logoYellow}>FIT</Text>
          </Text>

          <Pressable
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>
              Entrar
            </Text>
          </Pressable>
        </View>


        {/* Conteúdo */}
        <View style={styles.content}>

          <Text style={styles.counter}>
            {String(index + 1).padStart(2, '0')}
          </Text>

          <Text style={styles.title}>
            {item.title}
          </Text>

          <View style={styles.line} />

          <Text style={styles.description}>
            {item.description}
          </Text>


          {/* Botão do primeiro slide */}
          {item.type === 'hero' && (
            <Pressable
              style={styles.primaryButton}
              onPress={goToNext}
            >
              <Text style={styles.primaryButtonText}>
                CONHECER O SISTEMA
              </Text>

              <Text style={styles.arrow}>
                →
              </Text>
            </Pressable>
          )}


          {/* Botão do último */}
          {item.type === 'action' && (
            <View style={styles.actionButtons}>

              <Pressable
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Cadastro')}
              >
                <Text style={styles.primaryButtonText}>
                  CRIAR CONTA
                </Text>

                <Text style={styles.arrow}>
                  →
                </Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.secondaryButtonText}>
                  JÁ TENHO UMA CONTA
                </Text>
              </Pressable>

            </View>
          )}

        </View>


        {/* Rodapé */}
        <View style={styles.bottom}>

          <View style={styles.pagination}>
            {slides.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.dot,
                  dotIndex === currentIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>


          <View style={styles.navigationButtons}>

            <Pressable
              onPress={goToPrevious}
              disabled={currentIndex === 0}
              style={[
                styles.navArrow,
                currentIndex === 0 && styles.disabledArrow,
              ]}
            >
              <Text style={styles.navArrowText}>
                ←
              </Text>
            </Pressable>

            {!isLast && (
              <Pressable
                onPress={goToNext}
                style={styles.navArrow}
              >
                <Text style={styles.navArrowText}>
                  →
                </Text>
              </Pressable>
            )}

          </View>

        </View>

      </View>
    );
  }

  return (
    <View style={styles.container}>

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}

        horizontal
        pagingEnabled

        showsHorizontalScrollIndicator={false}

        onScroll={handleScroll}
        scrollEventThrottle={16}

        decelerationRate="fast"

        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#080808',
  },

  slide: {
    width,
    height,

    backgroundColor: '#080808',

    paddingHorizontal: 28,
    paddingTop: 55,
    paddingBottom: 35,

    justifyContent: 'space-between',
  },


  /* TOPO */

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },

  logoYellow: {
    color: '#FFD400',
  },

  loginText: {
    color: '#FFD400',
    fontSize: 14,
    fontWeight: '700',
  },


  /* CONTEÚDO */

  content: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 600,
  },

  counter: {
    color: '#FFD400',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,

    marginBottom: 20,
  },

  title: {
    color: '#ffffff',

    fontSize: 48,
    lineHeight: 49,

    fontWeight: '900',

    letterSpacing: -1,
  },

  line: {
    width: 55,
    height: 4,

    backgroundColor: '#FFD400',

    marginVertical: 28,
  },

  description: {
    color: '#A5A5A5',

    fontSize: 17,
    lineHeight: 27,

    maxWidth: 500,
  },


  /* BOTÕES */

  primaryButton: {
    marginTop: 35,

    backgroundColor: '#FFD400',

    minHeight: 56,

    paddingHorizontal: 20,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    alignSelf: 'flex-start',

    minWidth: 230,
  },

  primaryButtonText: {
    color: '#000000',

    fontSize: 13,
    fontWeight: '900',

    letterSpacing: 0.5,
  },

  arrow: {
    color: '#000000',

    fontSize: 22,
    fontWeight: '700',

    marginLeft: 20,
  },

  secondaryButton: {
    marginTop: 15,

    paddingVertical: 15,
  },

  secondaryButtonText: {
    color: '#ffffff',

    fontSize: 12,
    fontWeight: '700',

    textDecorationLine: 'underline',
  },

  actionButtons: {
    alignItems: 'flex-start',
  },


  /* RODAPÉ */

  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  dot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    backgroundColor: '#555555',
  },

  activeDot: {
    width: 25,

    backgroundColor: '#FFD400',
  },

  navigationButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  navArrow: {
    width: 42,
    height: 42,

    borderWidth: 1,
    borderColor: '#333333',

    alignItems: 'center',
    justifyContent: 'center',
  },

  navArrowText: {
    color: '#ffffff',

    fontSize: 20,
  },

  disabledArrow: {
    opacity: 0.25,
  },

});