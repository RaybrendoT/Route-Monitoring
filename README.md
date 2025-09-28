Esse é o link para baixar o pbf de manaus  https://download.geofabrik.de/south-america/brazil/norte-latest.osm.pbf

Essa é a estrutura do diretorio do projeto

<img width="1165" height="1019" alt="image" src="https://github.com/user-attachments/assets/89f9a35b-a109-4d79-8601-ab27b6ff78c5" />

script para popular o banco que vou commitar para ficar up via docker-compose.

CREATE TABLE IF NOT EXISTS usuarios_manaus (
    telefone VARCHAR(20) PRIMARY KEY, 
    nome VARCHAR(100) NOT NULL,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    checkin BOOLEAN DEFAULT false,
    data_atualizacao TIMESTAMP DEFAULT NOW()
);

INSERT INTO usuarios_manaus (telefone, nome, latitude, longitude, checkin, data_atualizacao)
VALUES
  ('9298000001', 'Maria Silva',   -3.11330,  -59.98720, false, NOW()),
  ('9298000002', 'João Pereira',   -3.11310,  -59.98750, false, NOW()),
  ('9298000003', 'Ana Costa',      -3.11340,  -59.98710, false, NOW()),

  ('9298001001', 'Carlos Souza',   -3.11200,  -59.98980, false, NOW()),
  ('9298001002', 'Beatriz Lima',   -3.11150,  -59.98950, false, NOW()),
  ('9298001003', 'Eduardo Rocha',  -3.11250,  -59.98920, false, NOW()),

  ('9298002001', 'Fernanda Gomes', -3.11000,  -59.99100, false, NOW()),
  ('9298002002', 'Lucas Ribeiro',  -3.10950,  -59.99120, false, NOW())
;


