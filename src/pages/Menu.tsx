import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Lang = 'en' | 'ru' | 'uz';
type LocaleMap = Record<Lang, string>;
type Badge = 'popular' | 'new' | 'chef' | null;

interface MenuItem {
  id: string;
  name: LocaleMap;
  desc: LocaleMap;
  price: number;
  image: string;
  ingredients: LocaleMap;
  preparation: LocaleMap;
  badge?: Badge;
}

interface MenuSection { id: number; category: string; items: MenuItem[]; }

const menuData: MenuSection[] = [
  {
    id: 1, category: 'starters',
    items: [
      {
        id: 'meze-platter', badge: 'popular',
        name: { en: 'Meze Platter', ru: 'Тарелка Мезе', uz: 'Meze Likopchasi' },
        desc: { en: 'Hummus, baba ganoush, tzatziki, warm pita', ru: 'Хумус, бабагануш, дзадзики, тёплая пита', uz: 'Xumus, baba ganush, tzatziki, issiq pita' },
        price: 120000,
        image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&auto=format&fit=crop&q=80',
        ingredients: { en: 'Chickpeas, tahini, eggplant, garlic, yogurt, cucumber, fresh pita bread.', ru: 'Нут, тахини, баклажаны, чеснок, йогурт, огурец, свежая пита.', uz: 'Noxat, tahini, baqlajon, sarimsoq, qatiq, bodring, yangi pita noni.' },
        preparation: { en: 'Traditional slow-roasted eggplant, freshly blended hummus, and house-made yogurt dip served with wood-fired pita.', ru: 'Медленно запечённые баклажаны, свежий хумус и йогуртовый соус с питой из дровяной печи.', uz: 'An\'anaviy sekin pishirilgan baqlajon, yangi tayyorlangan xumus va uy qatig\'idan qilingan sous o\'tin pechida yopilgan pita bilan tortiladi.' },
      },
      {
        id: 'grilled-octopus', badge: 'chef',
        name: { en: 'Grilled Octopus', ru: 'Осьминог на гриле', uz: 'Grilda sakkizoyoq' },
        desc: { en: 'Olive oil, lemon, oregano, fingerling potatoes', ru: 'Оливковое масло, лимон, орегано, молодой картофель', uz: 'Zaytun yog\'i, limon, oregano, kartoshka' },
        price: 240000,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80',
        ingredients: { en: 'Fresh Mediterranean octopus, extra virgin olive oil, lemon, oregano, fingerling potatoes.', ru: 'Свежий средиземноморский осьминог, оливковое масло первого отжима, лимон, орегано.', uz: 'Yangi O\'rta Yer dengizi sakkizoyog\'i, toza zaytun yog\'i, limon, oregano, kartoshka.' },
        preparation: { en: 'Sous-vide for 8 hours for tenderness, then char-grilled over open flame for a smoky finish.', ru: 'Су-вид 8 часов для нежности, затем обжаривается на открытом огне.', uz: 'Yumshoq bo\'lishi uchun 8 soat su-vid, so\'ngra ochiq olovda gril qilinadi.' },
      },
      {
        id: 'calamari-fritti', badge: 'new',
        name: { en: 'Calamari Fritti', ru: 'Кальмары Фритти', uz: 'Kalamari Fritti' },
        desc: { en: 'Crispy fried squid, saffron aioli, lemon zest', ru: 'Хрустящие кальмары, шафранный айоли', uz: 'Qovurilgan kalamar, zaʼfaron aioli' },
        price: 185000,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop&q=80',
        ingredients: { en: 'Fresh squid, semolina, saffron, garlic, lemon, fresh parsley.', ru: 'Свежие кальмары, манная крупа, шафран, чеснок, лимон, петрушка.', uz: 'Yangi kalamar, semolina, zaʼfaron, sarimsoq, limon, maydanoz.' },
        preparation: { en: 'Lightly coated in seasoned semolina and flash-fried at high heat, served with house saffron aioli.', ru: 'Покрыты приправленной манной крупой и быстро обжариваются при высокой температуре.', uz: 'Engil semolina bilan qoplangan va yuqori haroratda tez qovurilgan, zaʼfaron aioli bilan beriladi.' },
      },
    ],
  },
  {
    id: 2, category: 'mains',
    items: [
      {
        id: 'aegean-sea-bass', badge: 'popular',
        name: { en: 'Aegean Sea Bass', ru: 'Эгейский сибас', uz: 'Egey dengizi sibasi' },
        desc: { en: 'Whole roasted, capers, cherry tomatoes, white wine', ru: 'Целиком запечённый, каперсы, томаты, белое вино', uz: 'Butun pishirilgan, kapers, olcha pomidor, oq vino' },
        price: 350000,
        image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&auto=format&fit=crop&q=80',
        ingredients: { en: 'Whole sea bass, capers, cherry tomatoes, white wine, garlic, fresh herbs.', ru: 'Целый сибас, каперсы, помидоры черри, белое вино, чеснок, зелень.', uz: 'Butun sibas balig\'i, kapers, olcha pomidorlari, oq vino, sarimsoq, yangi o\'tlar.' },
        preparation: { en: 'Pan-seared and oven-roasted whole with a white wine and caper reduction.', ru: 'Обжаривается на сковороде и запекается целиком с соусом из белого вина и каперсов.', uz: 'Tovada qovurilib, oq vino va kapers sousi bilan pechda butunlay pishiriladi.' },
      },
      {
        id: 'lamb-chops', badge: 'chef',
        name: { en: 'Herb-Crusted Lamb Chops', ru: 'Бараньи рёбрышки в травах', uz: 'O\'tlar bilan qo\'y qovurg\'alari' },
        desc: { en: 'Pistachio crust, pomegranate reduction, roasted vegetables', ru: 'Фисташковая корочка, гранатовый соус', uz: 'Xandon pista qobig\'i, anor sousi' },
        price: 420000,
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&auto=format&fit=crop&q=80',
        ingredients: { en: 'Premium lamb racks, pistachios, pomegranate molasses, fresh Mediterranean herbs.', ru: 'Премиальные бараньи рёбрышки, фисташки, гранатовая патока, свежие травы.', uz: 'Premium qo\'y qovurg\'alari, xandon pista, anor shinni, yangi o\'tlar.' },
        preparation: { en: 'Marinated overnight in herbs, grilled to medium-rare, crusted with crushed pistachios.', ru: 'Маринуются ночь в травах, обжариваются до medium-rare и покрываются фисташками.', uz: 'O\'tlar bilan bir kecha marinadlanadi, o\'rtacha pishguncha gril qilinadi va pista bilan qoplanadi.' },
      },
      {
        id: 'chicken-levantine',
        name: { en: 'Levantine Chicken', ru: 'Левантийская курица', uz: 'Levant tovuqi' },
        desc: { en: 'Free-range chicken, sumac, preserved lemon, bulgur pilaf', ru: 'Домашняя курица, сумах, лимон, булгур', uz: 'Uy tovuqi, sumaq, tuzlangan limon, bulg\'ur pilavi' },
        price: 290000,
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80',
        ingredients: { en: 'Free-range chicken thigh, sumac, preserved lemon, olive oil, bulgur wheat, fresh mint.', ru: 'Бедро домашней курицы, сумах, солёный лимон, оливковое масло, булгур, мята.', uz: 'Uy tovuqining soni, sumaq, tuzlangan limon, zaytun yog\'i, bulg\'ur, yalpiz.' },
        preparation: { en: 'Marinated in sumac and preserved lemon for 24 hours, roasted in a wood-fired oven, served over saffron bulgur.', ru: 'Маринуется 24 часа, запекается в дровяной печи и подаётся с шафрановым булгуром.', uz: '24 soat marinadlanadi, o\'tin pechida pishiriladi va zaʼfaron bulg\'ur ustida beriladi.' },
      },
      {
        id: 'seafood-pasta', badge: 'new',
        name: { en: 'Mediterranean Seafood Pasta', ru: 'Паста с морепродуктами', uz: 'Dengiz mahsulotlari pastasi' },
        desc: { en: 'Prawns, clams, squid, cherry tomatoes, fresh basil', ru: 'Креветки, мидии, кальмары, томаты, базилик', uz: 'Krevetka, midiya, kalamar, olcha pomidor, rayhon' },
        price: 320000,
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop&q=80',
        ingredients: { en: 'Hand-cut linguine, tiger prawns, clams, squid, cherry tomatoes, garlic, white wine, fresh basil.', ru: 'Лингвини, тигровые креветки, мидии, кальмары, томаты черри, чеснок, белое вино.', uz: 'Qo\'lda kesilgan linguine, krevetkalar, midiyalar, kalamarlar, olcha pomidorlar, sarimsoq, oq vino.' },
        preparation: { en: 'Tossed in a saffron-infused white wine broth with fresh seafood sautéed in extra virgin olive oil.', ru: 'В шафрановом бульоне с белым вином и свежими морепродуктами на оливковом масле.', uz: 'Zaʼfaron bilan boyitilgan oq vino shorbasi va toza zaytun yog\'ida qovurilgan dengiz mahsulotlari bilan.' },
      },
    ],
  },
  {
    id: 3, category: 'desserts',
    items: [
      {
        id: 'pistachio-baklava', badge: 'popular',
        name: { en: 'Pistachio Baklava', ru: 'Фисташковая пахлава', uz: 'Pistali pahlava' },
        desc: { en: 'Phyllo dough, honey syrup, clotted cream', ru: 'Тесто фило, медовый сироп, сливки', uz: 'Fillo xamiri, asal siropi, qaymoq' },
        price: 95000,
        image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&auto=format&fit=crop&q=80',
        ingredients: { en: 'Phyllo dough, clarified butter, Antep pistachios, honey syrup, clotted cream.', ru: 'Тесто фило, топлёное масло, антепские фисташки, медовый сироп, сливки.', uz: 'Fillo xamiri, sariyog\', Antep pistalari, asal siropi, qaymoq.' },
        preparation: { en: 'Hand-rolled phyllo layered with premium pistachios, baked until golden, steeped in light honey syrup.', ru: 'Свёрнутое вручную тесто с фисташками, выпекается до золотистого цвета и пропитывается медовым сиропом.', uz: 'Qo\'lda yoyilgan fillo xamiri pistalar bilan qavatlanadi, qizarguncha pishiriladi va asal siropiga botiriladi.' },
      },
      {
        id: 'chocolate-lava', badge: 'chef',
        name: { en: 'Chocolate Lava Cake', ru: 'Шоколадный фондан', uz: 'Shokoladli lava keki' },
        desc: { en: 'Dark chocolate, raspberry coulis, vanilla ice cream', ru: 'Тёмный шоколад, малиновый кули, мороженое', uz: 'Qora shokolad, malina kulisi, vanil muzdeki' },
        price: 85000,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
        ingredients: { en: '70% dark Valrhona chocolate, butter, farm eggs, caster sugar, raspberry, vanilla ice cream.', ru: '70% шоколад Valrhona, масло, яйца, сахар, малина, ванильное мороженое.', uz: '70% Valrhona shokoladi, sariyog\', tuxum, qand, malina, vanil muzdeki.' },
        preparation: { en: 'Baked to order for exactly 9 minutes for a perfectly molten centre, served immediately with house vanilla ice cream.', ru: 'Выпекается ровно 9 минут для идеальной текучей середины, подаётся сразу с мороженым.', uz: 'Mukammal suyuq markazga ega bo\'lishi uchun aniq 9 daqiqa pishiriladi, uy vanil muzdeки bilan darhol beriladi.' },
      },
      {
        id: 'rose-sorbet', badge: 'new',
        name: { en: 'Rose & Cardamom Sorbet', ru: 'Сорбет из розы и кардамона', uz: 'Atirgul va kardamon sorbeti' },
        desc: { en: 'Damascus rose water, cardamom, fresh berry garnish', ru: 'Дамасская розовая вода, кардамон, ягоды', uz: 'Damashq atirgul suvi, kardamon, yangi meva' },
        price: 70000,
        image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=800&auto=format&fit=crop&q=80',
        ingredients: { en: 'Damascus rose water, cardamom, sugar, lemon juice, seasonal berries, edible rose petals.', ru: 'Дамасская розовая вода, кардамон, сахар, лимонный сок, ягоды, лепестки роз.', uz: 'Damashq atirgul suvi, kardamon, qand, limon sharbati, mavsumiy mevalar, atirgul gullari.' },
        preparation: { en: 'Churned with Damascus rose water and ground cardamom, served in a chilled copper bowl with fresh berries.', ru: 'Взбивается с розовой водой и кардамоном, подаётся в охлаждённой медной чаше со свежими ягодами.', uz: 'Atirgul suvi va kardamon bilan aylantiriladi, sovutilgan mis idishda yangi mevalar bilan beriladi.' },
      },
    ],
  },
  {
    id: 4, category: 'drinks',
    items: [
      {
        id: 'turkish-tea',
        name: { en: 'Turkish Çay', ru: 'Турецкий Чай', uz: 'Turk Choyi' },
        desc: { en: 'Premium black tea from Rize, double-brewed', ru: 'Премиальный чай из Ризе, двойное заваривание', uz: 'Rize\'dan premium qora choy, ikki marta damlatilgan' },
        price: 25000,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
        ingredients: { en: 'Premium Rize black tea, filtered water. Served with two sugar cubes.', ru: 'Листья чёрного чая Rize, фильтрованная вода. С двумя кусочками сахара.', uz: 'Premium Rize qora choy barglari, filtrlangan suv. Ikki bo\'lak qand bilan.' },
        preparation: { en: 'Brewed in the traditional çaydanlık double-kettle method, served in tulip glasses.', ru: 'Завариваются традиционным методом двойного чайника, подаётся в стаканах-тюльпанах.', uz: 'An\'anaviy çaydanlık ikki qozoncha usulida, lola shaklidagi stakanlarda beriladi.' },
      },
      {
        id: 'ayran',
        name: { en: 'House Ayran', ru: 'Домашний Айран', uz: 'Uy Ayroni' },
        desc: { en: 'Chilled yogurt drink, fresh mint, sea salt', ru: 'Охлаждённый йогуртовый напиток, мята, морская соль', uz: 'Sovutilgan qatiq ichimligi, yalpiz, dengiz tuzi' },
        price: 30000,
        image: 'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=800&auto=format&fit=crop&q=80',
        ingredients: { en: 'Full-fat yogurt, filtered water, sea salt, fresh mint leaves.', ru: 'Жирный йогурт, фильтрованная вода, морская соль, свежая мята.', uz: 'To\'liq yogʻli qatiq, filtrlangan suv, dengiz tuzi, yangi yalpiz barglari.' },
        preparation: { en: 'Whipped daily from whole-milk yogurt, lightly salted, served ice-cold with fresh garden mint.', ru: 'Готовится ежедневно из цельного йогурта, слегка солёный, подаётся ледяным со свежей мятой.', uz: 'Kunlik butun sutli qatiqdan tayyorlangan, engil tuzlangan va yangi yalpiz bilan muzday beriladi.' },
      },
      {
        id: 'limonata', badge: 'popular',
        name: { en: 'Aegean Limonata', ru: 'Эгейская лимонада', uz: 'Egey limonadasi' },
        desc: { en: 'Fresh-squeezed lemon, basil, sparkling water', ru: 'Свежевыжатый лимон, базилик, газированная вода', uz: 'Yangi siqilgan limon, rayhon, gazlangan suv' },
        price: 45000,
        image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&auto=format&fit=crop&q=80',
        ingredients: { en: 'Fresh lemons, basil, cane sugar syrup, sparkling mineral water, ice.', ru: 'Свежие лимоны, базилик, тростниковый сахарный сироп, газированная вода, лёд.', uz: 'Yangi limonlar, rayhon barglari, qamish qand siropi, gazlangan mineral suv, muz.' },
        preparation: { en: 'Freshly squeezed to order, muddled with garden basil, sweetened with house cane syrup and topped with Italian sparkling water.', ru: 'Свежевыжатый, смешивается с базиликом, подслащивается сиропом и доливается газированной водой.', uz: 'Buyurtmaga ko\'ra yangi siqiladi, rayhon bilan ezilib, qamish siropi va italyan gazlangan suvi qo\'shiladi.' },
      },
    ],
  },
];

const BADGE_STYLES: Record<string, string> = {
  popular: 'bg-amber-50 text-amber-600 border border-amber-200',
  new:     'bg-emerald-50 text-emerald-600 border border-emerald-200',
  chef:    'bg-bodrum-navy/5 text-bodrum-navy border border-bodrum-navy/15',
};

export default function Menu() {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const categories = ['all', 'starters', 'mains', 'desserts', 'drinks'];
  const lang = (['en', 'ru', 'uz'].includes(i18n.language) ? i18n.language : 'en') as Lang;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(p);

  const filteredItems = menuData
    .filter(s => activeCategory === 'all' || s.category === activeCategory)
    .flatMap(s => s.items)
    .filter(item => {
      const q = searchQuery.toLowerCase();
      return !q || item.name[lang].toLowerCase().includes(q) || item.desc[lang].toLowerCase().includes(q);
    });

  return (
    <div className="min-h-screen bg-bodrum-white">

      {/* Page Hero */}
      <div className="relative h-52 md:h-64 flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&auto=format&fit=crop&q=80"
            alt="Menu"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bodrum-navy/60 to-bodrum-navy/90" />
        </div>
        <div className="relative z-10 w-full text-center pb-10 pt-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-bodrum-gold text-xs uppercase tracking-[0.35em] mb-2 font-semibold"
          >
            Bodrum Tashkent
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl text-white"
          >
            {t('menu.title')}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t('menu.search')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-bodrum-gold focus:ring-1 focus:ring-bodrum-gold transition-all shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200',
                  activeCategory === cat
                    ? 'bg-bodrum-navy text-white shadow-md'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-bodrum-navy/40 hover:text-bodrum-navy'
                )}
              >
                {t(`menu.category.${cat}`)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-5 items-start">
          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? filteredItems.map(item => {
              const isExpanded = expandedItem === item.id;
              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'group bg-white rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer',
                    isExpanded
                      ? 'border-bodrum-gold/40 shadow-lg shadow-bodrum-gold/5'
                      : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'
                  )}
                  onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                >
                  {/* Card header */}
                  <div className="flex gap-0">
                    {/* Image */}
                    <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name[lang]}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 px-4 py-3.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-serif text-[17px] text-bodrum-navy leading-snug">{item.name[lang]}</h3>
                          {item.badge && (
                            <span className={cn('flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full', BADGE_STYLES[item.badge])}>
                              {t(`menu.badge.${item.badge}`)}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{item.desc[lang]}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-dashed border-gray-100">
                        <span className="font-mono text-sm font-bold text-bodrum-gold">{formatPrice(item.price)}</span>
                        <span className={cn(
                          'flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition-colors',
                          isExpanded ? 'text-bodrum-navy' : 'text-bodrum-gold'
                        )}>
                          {isExpanded ? t('menu.showLess') : t('menu.viewDetails')}
                          <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.25 }} className="inline-block">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </motion.span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-5 pt-3 border-t border-bodrum-gold/10 grid md:grid-cols-2 gap-5 bg-gradient-to-b from-amber-50/30 to-transparent">
                          {[
                            { label: t('menu.ingredients'), text: item.ingredients[lang] },
                            { label: t('menu.preparation'), text: item.preparation[lang] },
                          ].map(({ label, text }) => (
                            <div key={label}>
                              <p className="text-[10px] font-bold text-bodrum-navy uppercase tracking-[0.18em] mb-2 flex items-center gap-2">
                                <span className="w-4 h-px bg-bodrum-gold flex-shrink-0" />
                                {label}
                              </p>
                              <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            }) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <p className="text-3xl mb-3">🍽</p>
                <p className="text-gray-400 text-sm">{t('menu.noResults')}</p>
                <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="mt-4 text-xs text-bodrum-gold font-semibold uppercase tracking-widest hover:underline">
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
