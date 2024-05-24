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
