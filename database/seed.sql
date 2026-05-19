insert into products (id, name, category, price, specs, description, image, stock, featured)
values
  (
    'cabo-usb-c-trancado',
    'Cabo USB-C Trancado 1.2m',
    'Cabos',
    34.90,
    'LEN: 1.2m | PWR: 60W | STD: USB 3.1',
    'Cabo USB-C com nylon trancado de alta durabilidade, suporta carga rapida 60W.',
    'https://images.unsplash.com/photo-1603539444875-76e7684265f6?auto=format&fit=crop&w=900&q=80',
    18,
    true
  ),
  (
    'pelicula-vidro-9h',
    'Pelicula Vidro 9H Anti-riscos',
    'Peliculas',
    24.90,
    'DUREZ: 9H | TIPO: Vidro Temperado | UV: Protecao',
    'Pelicula de vidro temperado 9H com cobertura total e protecao anti-impressao.',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=900&q=80',
    32,
    true
  ),
  (
    'carregador-65w-gan',
    'Carregador 65W GaN Turbo',
    'Carregadores',
    89.90,
    'PWR: 65W | PORT: 2x USB-C + 1x USB-A | TECH: GaN',
    'Carregador compacto com tecnologia GaN para notebook, celular e tablet.',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80',
    9,
    true
  )
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  specs = excluded.specs,
  description = excluded.description,
  image = excluded.image,
  stock = excluded.stock,
  featured = excluded.featured;

insert into testimonials (id, name, role, text, rating)
values
  ('ana', 'Ana Paula', 'Cliente celular', 'Atendimento rapido e diagnostico claro. Resolveram meu celular no mesmo dia.', 5),
  ('marcos', 'Marcos Silva', 'Cliente notebook', 'Gostei do acompanhamento da ordem de servico e da transparencia no orcamento.', 5),
  ('renata', 'Renata Koch', 'Cliente empresa', 'Levei dois computadores da loja e recebi tudo com laudo, prazo e garantia.', 5)
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  text = excluded.text,
  rating = excluded.rating;

insert into blog_posts (id, title, excerpt, date, category, read_time, "readTime", image, content)
values
  (
    'como-evitar-superaquecimento',
    'Como evitar superaquecimento no celular',
    'Cuidados simples para preservar bateria, tela e placa em dias de uso intenso.',
    '2026-05-10',
    'Celulares',
    '4 min',
    '4 min',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    'Evite carregar o aparelho em locais abafados, remova capas muito grossas durante jogos e procure assistencia se o aquecimento vier acompanhado de desligamentos.'
  ),
  (
    'backup-antes-do-reparo',
    'Por que fazer backup antes do reparo',
    'Uma rotina rapida de seguranca evita perda de fotos, contatos e conversas.',
    '2026-05-08',
    'Seguranca',
    '3 min',
    '3 min',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
    'Antes de deixar o aparelho para reparo, confirme se fotos, contatos e arquivos importantes estao salvos em nuvem ou em outro dispositivo.'
  )
on conflict (id) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  date = excluded.date,
  category = excluded.category,
  read_time = excluded.read_time,
  "readTime" = excluded."readTime",
  image = excluded.image,
  content = excluded.content;
