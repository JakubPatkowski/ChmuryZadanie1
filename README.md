# Plik server.js:

  ![image](https://github.com/JakubPatkowski/ChmuryZadanie1/assets/61908447/d694399f-2797-4848-9abc-0f996cf76492)

# Plik Dockerfile:

    # syntax = docker/dockerfile:experimental
    # ustawienie ekperymentalnej składni Dockefile
    
    # --------- ETAP 1 -------------------------
    
    # Ustawienie obrazu bazowego jako 'scratch' (pusty obraz)
    FROM scratch as builder
    
    # Dodanie zawartości Alpine Linux do obrazu
    ADD alpine-minirootfs-3.20.0-x86_64.tar.gz /
    
    LABEL maintainer="Jakub Patkowski"
    
    # dodanie git
    RUN apk add git 
    
    # Klonowanie repozytorium z GitHuba za pomocą git i ustawienie uprawnień dla użytkownika 'node'
    RUN --mount=type=ssh git clone https://github.com/JakubPatkowski/ChmuryZadanie1 && \
        addgroup -S node && \
        adduser -S node -G node && \
        rm -rf /var/cache/apk
    
    # Ustawienie użytkownika 'node' jako domyślnego użytkownika dla polecenia RUN i COPY
    USER node
    
    # Ustawienie katalogu roboczego dla użytkownika 'node'
    WORKDIR /home/node/app
    
    # Skopiowanie pliku 'server.js' do katalogu roboczego
    COPY --chown=node:node server.js .
    
    
    # --------- ETAP 2 ------------------------
    # Ustawienie obrazu bazowego jako 'node:iron-alpine3.20'
    FROM node:iron-alpine3.20
    
    # Zdefiniowanie zmiennej srodowiskowej 'VERSION' z domyślną wartością 'v1.0.0'
    ARG VERSION
    
    ENV VERSION=${VERSION:-v1.0.0}
    
    # Instalacja git i curl w obrazie
    RUN apk add --no-cache git && \ 
        apk update && \
        apk upgrade && \
        apk add --no-cache curl=8.7.1-r0
    
    # Ustawienie użytkownika 'node' jako domyślnego użytkownika dla polecenia RUN i COPY
    USER node
    
    # Utworzenie katalogu '/home/node/app' 
    RUN mkdir -p /home/node/app
    
    # Ustawienie katalogu roboczego dla użytkownika 'node'
    WORKDIR /home/node/app
    
    # Skopiowanie pliku 'server.js' z etapu 1 do katalogu roboczego
    COPY --from=builder --chown=node:node /home/node/app/server.js ./server.js
    
    # Ustawienie portu, który zostanie wystawiony
    EXPOSE 3000
    
    # Konfiguracja testu stanu aplikacji
    HEALTHCHECK --interval=4s --timeout=20s --start-period=2s --retries=3 \
        CMD curl -f http://localhost:3000/ || exit 1
        
    # Ustawienie punktu wejściowego dla kontenera
    ENTRYPOINT ["node", "server.js"]


# Uruchamianie serwera lokalnie

Możne uruchomić serwer lokalnie

    node server.js

Po uruchomieniu serwera pojawia się komunikat

  ![image](https://github.com/JakubPatkowski/ChmuryZadanie1/assets/61908447/3ec42a41-9ae2-4806-92b7-c68058e1b982)

Widok w przeglądarce

![image](https://github.com/JakubPatkowski/ChmuryZadanie1/assets/61908447/35899310-3d9b-4339-83aa-18faf34bec78)

# Budowanie obrazu

Aby zbudować obraz należy wykonać polecenie:

    docker buildx build --platform linux/amd64,linux/arm64 --cache-from type=registry,ref=jakubpatkowski/zadanie1 --cache-to type=registry,ref=jakubpatkowski/zadanie1 --push -t jakubpatkowski/zadanie1:v6 .

![image](https://github.com/JakubPatkowski/ChmuryZadanie1/assets/61908447/f462ebba-d010-4909-a55b-862dd3f5c9d8)


# Uruchamianie kontenera

Kontener uruchamiamy komendą:

    docker run -p 3000:8080 --name zadanie1 jakubpatkowski/zadanie1:v6

![image](https://github.com/JakubPatkowski/ChmuryZadanie1/assets/61908447/269b9315-fc33-4a52-94c2-88aa7db78868)


# Wyświetlanie logów

Komenda pozwalająca wyśwetlić logi kontenera:

    docker logs zadanie1

![image](https://github.com/JakubPatkowski/ChmuryZadanie1/assets/61908447/0f6c6951-9de1-4c64-9173-5d50885c3480)

# Liczba warstw

Komenda pozwalająca sprawdzić liczbę warst kontenera

    docker inspect jakubpatkowski/zadanie1:v6

![image](https://github.com/JakubPatkowski/ChmuryZadanie1/assets/61908447/a5f20245-eebe-48ee-b664-b743ca1097f8)

# Wygląd strony w przeglądarce

![image](https://github.com/JakubPatkowski/ChmuryZadanie1/assets/61908447/697561a2-a512-46e9-a3bf-5e54b62e26a7)

# Vulnerabilities

Sprawdzenie ilość vulnerabilities

    docker scout cves jakubpatkowski/zadanie1:v6

![image](https://github.com/JakubPatkowski/ChmuryZadanie1/assets/61908447/03cd90a2-b0e5-4a5d-a718-418c676316d0)

# ===== CZĘŚĆ DODATKOWA =====

# Builder

Dodawanie buildera do dockera:

    docker buildx create --name zadanie1build --driver docker-container --use zadanie1build

![image](https://github.com/JakubPatkowski/ChmuryZadanie1/assets/61908447/9ae60152-8672-499e-bbe7-b1c894bdf344)

Możemy wyświetlić informacje o koneterze za pomocą komnedy:

    docker buildx inspect zadanie1build --bootstrap

Wynik działania komendy:

![image](https://github.com/JakubPatkowski/ChmuryZadanie1/assets/61908447/5233f43f-7a51-4bd0-bd34-ff16ac78795e)

# Budowanie obrazu

Budujemy obraz za pomocą polecenia

    docker buildx build --platform linux/amd64,linux/arm64 --cache-from type=registry,ref=jakubpatkowski/zadanie1 --cache-to type=registry,ref=jakubpatkowski/zadanie1 --push -t jakubpatkowski/zadanie1:v6 .

![image](https://github.com/JakubPatkowski/ChmuryZadanie1/assets/61908447/9f07ecd0-e4a2-498b-a1c6-310474a603c4)
