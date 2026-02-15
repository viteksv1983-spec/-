from sqlalchemy.orm import Session
import crud
import models
import schemas
from database import SessionLocal, engine

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Clear existing data to ensure fresh seed
    print("Clearing existing data...")
    try:
        db.query(models.OrderItem).delete()
        db.query(models.Order).delete()
        db.query(models.Cake).delete()
        db.commit()
    except Exception as e:
        print(f"Error clearing data: {e}")
        db.rollback()

    cakes = [
        schemas.CakeCreate(
            name="Наполеон Класичний",
            description="Найтонші листкові коржі, просочені ніжним заварним кремом з додаванням натуральної ванілі. Смак дитинства!",
            price=250.0,
            image_url="/static/images/napoleon.png",
            is_available=True,
            weight=1200.0,
            ingredients="Борошно пшеничне, маргарин, молоко, цукор, яйця, масло вершкове, ванілін, сіль",
            shelf_life="5 днів при температурі +2...+6°C",
            category="cakes"
        ),
        schemas.CakeCreate(
            name="Медовик Домашній",
            description="Ароматні медові коржі зі сметанно-вершковим кремом та волоським горіхом. Неймовірно м'який і соковитий.",
            price=220.0,
            image_url="/static/images/medovik.png",
            is_available=True,
            weight=1000.0,
            ingredients="Борошно, мед натуральний, вершки, сметана, яйця, цукор, сода, горіх волоський",
            shelf_life="7 днів при температурі +2...+6°C",
            category="cakes"
        ),
        schemas.CakeCreate(
            name="Червоний Оксамит",
            description="Знаменитий американський торт. Вологі бісквіти червоного кольору з легкою ноткою какао та білосніжний крем-чіз.",
            price=350.0,
            image_url="/static/images/red_velvet.png",
            is_available=True,
            weight=1100.0,
            ingredients="Борошно, какао-порошок, вершковий сир, вершки, цукор, яйця, барвник харчовий, ваніль",
            shelf_life="5 днів при температурі +2...+6°C",
            category="cakes"
        ),
        schemas.CakeCreate(
            name="Естерхазі Еліт",
            description="Вишуканий угорський торт. Білково-горіхові коржі (фундук і мигдаль) та масляний крем з додаванням коньяку.",
            price=450.0,
            image_url="/static/images/esterhazi.jpg",
            is_available=True,
            weight=1300.0,
            ingredients="Яєчний білок, фундук мелений, мигдаль, цукор, масло вершкове, коньяк, ваніль",
            shelf_life="7 днів при температурі +2...+6°C",
            category="cakes"
        ),
        schemas.CakeCreate(
            name="Шоколадний Трюфель",
            description="Мрія шокоголіка. Шоколадний бісквіт, шоколадний мус та покриття з бельгійського темного шоколаду.",
            price=320.0,
            image_url="/static/images/truffle.png",
            is_available=True,
            weight=900.0,
            ingredients="Шоколад темний бельгійський, какао-порошок, вершки 33%, яйця, цукор, борошно, масло",
            shelf_life="5 днів при температурі +2...+6°C",
            category="cakes"
        ),
        schemas.CakeCreate(
            name="Вишнева Фантазія",
            description="Легкий бісквіт, прошарок з вишневого компоте та повітряний йогуртовий крем. Ідеальний літній десерт.",
            price=280.0,
            image_url="/static/images/cherry.jpg",
            is_available=True,
            weight=1000.0,
            ingredients="Бісквіт ванільний, вишня, йогурт натуральний, вершки, цукор, желатин, ваніль",
            shelf_life="3 дні при температурі +2...+6°C",
            category="cakes"
        ),
        schemas.CakeCreate(
            name="Київський Дар",
            description="Легендарний торт. Хрусткі повітряно-горіхові коржі з кеш'ю та крем Шарлотт.",
            price=380.0,
            image_url="/static/images/kyivskyi.jpg",
            is_available=True,
            weight=1200.0,
            ingredients="Яєчний білок, кеш'ю смажений, цукор, борошно, масло вершкове, молоко згущене, ванілін",
            shelf_life="10 днів при температурі +2...+6°C",
            category="cakes"
        ),
        schemas.CakeCreate(
            name="Прага",
            description="Класичний шоколадний торт з абрикосовим джемом та шоколадною помадкою за ДСТУ.",
            price=290.0,
            image_url="/static/images/prague.jpg",
            is_available=True,
            weight=1100.0,
            ingredients="Бісквіт шоколадний, згущене молоко, масло, какао, джем абрикосовий, коньяк, ваніль",
            shelf_life="7 днів при температурі +2...+6°C",
            category="cakes"
        ),
        schemas.CakeCreate(
            name="Чізкейк Нью-Йорк",
            description="Класичний пісочний корж та шовковиста начинка з вершкового сиру. Подається з ягідним соусом.",
            price=420.0,
            image_url="/static/images/cheesecake.jpg",
            is_available=True,
            weight=1000.0,
            ingredients="Сир вершковий Філадельфія, печиво, масло вершкове, цукор, яйця, вершки, ваніль, лимонний сік",
            shelf_life="5 днів при температурі +2...+6°C",
            category="cakes"
        ),
         schemas.CakeCreate(
            name="Тірамісу",
            description="Італійський десерт. Палички савоярді, просочені еспресо з лікером, та крем маскарпоне.",
            price=360.0,
            image_url="/static/images/tiramisu.jpg",
            is_available=True,
            weight=800.0,
            ingredients="Сир маскарпоне, печиво савоярді, кава еспресо, лікер Амаретто, яйця, цукор, какао-порошок",
            shelf_life="3 дні при температурі +2...+6°C",
            category="cakes"
        ),
        schemas.CakeCreate(
            name="Снікерс",
            description="Вологий шоколадний бісквіт, домашня солона карамель, смажений арахіс та нуга.",
            price=330.0,
            image_url="/static/images/snickers.jpg",
            is_available=True,
            weight=1000.0,
            ingredients="Бісквіт шоколадний, арахіс смажений, карамель, нуга, шоколад молочний, вершки, масло",
            shelf_life="5 днів при температурі +2...+6°C",
            category="cakes"
        ),
        schemas.CakeCreate(
            name="Фруктовий Рай",
            description="Ванільний бісквіт з прошарками з ківі, банана та апельсина в легкому сметанному кремі.",
            price=260.0,
            image_url="/static/images/fruit.png",
            is_available=True,
            weight=1100.0,
            ingredients="Бісквіт ванільний, ківі, банан, апельсин, сметана, вершки, цукор, желатин",
            shelf_life="2 дні при температурі +2...+6°C",
            category="cakes"
        ),
        # Cookies (Печиво)
        schemas.CakeCreate(
            name="Печиво «Choco Apricot»",
            description="Хрустке печиво з шоколадними шматочками та абрикосовою начинкою. Ідеальне доповнення до кави.",
            price=85.0,
            image_url="/static/images/cookie_choco_apricot.jpg",
            is_available=True,
            weight=300.0,
            ingredients="Борошно пшеничне, шоколад, абрикосове пюре, цукор, масло, яйця",
            shelf_life="14 днів при температурі +18...+22°C",
            category="cookies"
        ),
        schemas.CakeCreate(
            name="Печиво «Американер з глазурованою крихтою»",
            description="М'яке американське печиво з ванільною глазур'ю та хрусткою крихтою зверху.",
            price=75.0,
            image_url="/static/images/cookie_amerikaner.jpg",
            is_available=True,
            weight=250.0,
            ingredients="Борошно, цукор пудра, масло вершкове, яйця, ваніль, глазур",
            shelf_life="10 днів при температурі +18...+22°C",
            category="cookies"
        ),
        schemas.CakeCreate(
            name="Печиво «Ванільне»",
            description="Класичне пісочне печиво з насиченим ванільним ароматом. Розсипчасте та ніжне.",
            price=65.0,
            image_url="/static/images/cookie_vanilla.jpg",
            is_available=True,
            weight=300.0,
            ingredients="Борошно пшеничне, масло вершкове, цукор, яйця, ваніль натуральна",
            shelf_life="21 день при температурі +18...+22°C",
            category="cookies"
        ),
        schemas.CakeCreate(
            name="Печиво «Грибочок»",
            description="Пісочне печиво у формі грибочка з білково-горіховою 'шапочкою'. Улюблене печиво дітей!",
            price=90.0,
            image_url="/static/images/cookie_mushroom.jpg",
            is_available=True,
            weight=200.0,
            ingredients="Борошно, масло, цукор, яєчний білок, горіх волоський, какао",
            shelf_life="14 днів при температурі +18...+22°C",
            category="cookies"
        ),
        schemas.CakeCreate(
            name="Печиво «Каприз»",
            description="Вигнуте пісочне печиво з шоколадним покриттям. Розтає у роті!",
            price=95.0,
            image_url="/static/images/cookie_caprice.jpg",
            is_available=True,
            weight=250.0,
            ingredients="Борошно, масло вершкове, цукор, шоколад молочний, ваніль",
            shelf_life="14 днів при температурі +18...+22°C",
            category="cookies"
        ),
        schemas.CakeCreate(
            name="Печиво «Кільце»",
            description="Пісочне печиво у формі кільця, притрушене цукровою пудрою. Легкий та повітряний смак.",
            price=70.0,
            image_url="/static/images/cookie_ring.jpg",
            is_available=True,
            weight=300.0,
            ingredients="Борошно, масло, цукор, яйця, сметана, розпушувач",
            shelf_life="14 днів при температурі +18...+22°C",
            category="cookies"
        ),
        schemas.CakeCreate(
            name="Печиво «Крем-брюле»",
            description="Пісочне печиво з начинкою зі смаком крем-брюле. Карамельна насолода!",
            price=85.0,
            image_url="/static/images/cookie_vanilla.jpg", # Fallback for creme brulee
            is_available=True,
            weight=250.0,
            ingredients="Борошно, масло, цукор, крем карамельний, яйця, ваніль",
            shelf_life="10 днів при температурі +18...+22°C",
            category="cookies"
        ),
        schemas.CakeCreate(
            name="Печиво «Курабйє»",
            description="Класичне східне пісочне печиво що розтікається у роті. М'яке та соковите.",
            price=80.0,
            image_url="/static/images/cookie_vanilla.jpg", # Fallback for kurabye
            is_available=True,
            weight=300.0,
            ingredients="Борошно, масло вершкове, цукор пудра, крохмаль, ваніль",
            shelf_life="14 днів при температурі +18...+22°C",
            category="cookies"
        ),
        schemas.CakeCreate(
            name="Печиво «Молочне»",
            description="Ніжне молочне печиво з легким вершковим смаком. Ідеально для дітей.",
            price=65.0,
            image_url="/static/images/cookie_milk.jpg",
            is_available=True,
            weight=300.0,
            ingredients="Борошно, молоко, масло, цукор, яйця, сода",
            shelf_life="14 днів при температурі +18...+22°C",
            category="cookies"
        ),
        schemas.CakeCreate(
            name="Печиво «Вівсяне з кунжутом»",
            description="Корисне вівсяне печиво з кунжутом та медом. Енергія на весь день!",
            price=70.0,
            image_url="/static/images/cookie_oatmeal.jpg",
            is_available=True,
            weight=300.0,
            ingredients="Вівсяні пластівці, борошно, кунжут, мед, масло, цукор, яйця",
            shelf_life="14 днів при температурі +18...+22°C",
            category="cookies"
        ),
        schemas.CakeCreate(
            name="Печиво «Савоярді»",
            description="Бісквітне печиво у формі паличок. Використовується для тірамісу та десертів.",
            price=95.0,
            image_url="/static/images/cookie_savoyardi.jpg",
            is_available=True,
            weight=200.0,
            ingredients="Борошно, яйця, цукор, цукрова пудра, ваніль",
            shelf_life="21 день при температурі +18...+22°C",
            category="cookies"
        ),
        schemas.CakeCreate(
            name="Рогалик з абрикосовою начинкою",
            description="Листкові рогалики з натуральною абрикосовою начинкою. Хрусткі та ароматні.",
            price=100.0,
            image_url="/static/images/cookie_apricot_roll.jpg",
            is_available=True,
            weight=300.0,
            ingredients="Тісто листкове, абрикосове повидло, цукор, масло",
            shelf_life="7 днів при температурі +18...+22°C",
            category="cookies"
        ),
        # Sweets (Солодощі)
        schemas.CakeCreate(
            name="Зефір «Ванільний біло-рожевий»",
            description="Повітряний зефір на агарі з натуральною ваніллю. Ніжний та легкий десерт.",
            price=120.0,
            image_url="/static/images/sweet_zephyr_vanilla.jpg",
            is_available=True,
            weight=250.0,
            ingredients="Яблучне пюре, цукор, агар-агар, яєчний білок, ваніль, барвник натуральний",
            shelf_life="14 днів при температурі +15...+21°C",
            category="sweets"
        ),
        schemas.CakeCreate(
            name="Зефір «Золотий Ключик»",
            description="Класичний білий зефір в шоколадній глазурі. Справжня класика!",
            price=150.0,
            image_url="/static/images/sweet_zephyr_vanilla.jpg", # Fallback for gold
            is_available=True,
            weight=200.0,
            ingredients="Яблучне пюре, цукор, агар, білок, шоколадна глазур, ваніль",
            shelf_life="21 день при температурі +15...+21°C",
            category="sweets"
        ),
        schemas.CakeCreate(
            name="Десерт «Шу»",
            description="Заварні тістечка зі смачним кремом. Класичний французький десерт.",
            price=180.0,
            image_url="/static/images/sweet_shu.jpg",
            is_available=True,
            weight=150.0,
            ingredients="Борошно, яйця, масло, вода, крем заварний, цукрова пудра",
            shelf_life="3 дні при температурі +2...+6°C",
            category="sweets"
        ),
        schemas.CakeCreate(
            name="Желе «Чудо»",
            description="Фруктове желе з натуральних соків. Освіжаючий та легкий десерт.",
            price=65.0,
            image_url="/static/images/sweet_jelly.jpg",
            is_available=True,
            weight=200.0,
            ingredients="Фруктовий сік, желатин, цукор, лимонна кислота",
            shelf_life="5 днів при температурі +2...+6°C",
            category="sweets"
        ),
        schemas.CakeCreate(
            name="Солодка картопля",
            description="Тістечко з печива та какао у формі картоплі. Смачний та оригінальний десерт.",
            price=55.0,
            image_url="/static/images/sweet_shu.jpg", # Fallback for potato
            is_available=True,
            weight=100.0,
            ingredients="Печиво подрібнене, какао, масло, цукор, молоко згущене",
            shelf_life="10 днів при температурі +15...+21°C",
            category="sweets"
        ),
        schemas.CakeCreate(
            name="Тістечко «Едем»",
            description="Бісквітне тістечко з кремом та фруктовим желе. Райська насолода!",
            price=75.0,
            image_url="/static/images/sweet_edem.jpg",
            is_available=True,
            weight=120.0,
            ingredients="Бісквіт, крем вершковий, желе фруктове, ягоди, шоколад",
            shelf_life="3 дні при температурі +2...+6°C",
            category="sweets"
        ),
        schemas.CakeCreate(
            name="Тістечко «Ласточка»",
            description="Пісочне тістечко з горіховим безе та масляним кремом. Класика української кондитерської.",
            price=85.0,
            image_url="/static/images/sweet_lastivka.jpg",
            is_available=True,
            weight=100.0,
            ingredients="Пісочне тісто, яєчний білок, горіхи, масло, цукор, ваніль",
            shelf_life="7 днів при температурі +15...+21°C",
            category="sweets"
        ),
        schemas.CakeCreate(
            name="Кекс «Зерновий»",
            description="Корисний кекс з зернами та сухофруктами. Енергія та смак!",
            price=60.0,
            image_url="/static/images/sweet_shu.jpg", # Fallback for muffin
            is_available=True,
            weight=150.0,
            ingredients="Борошно цільнозернове, насіння, родзинки, мед, яйця, олія",
            shelf_life="10 днів при температурі +18...+22°C",
            category="sweets"
        ),
        schemas.CakeCreate(
            name="Рогалик з вишневою начинкою",
            description="Листковий рогалик з соковитою вишневою начинкою. Кисло-солодкий смак!",
            price=95.0,
            image_url="/static/images/sweet_cherry_roll.jpg",
            is_available=True,
            weight=300.0,
            ingredients="Тісто листкове, вишня, цукор, крохмаль, масло",
            shelf_life="7 днів при температурі +18...+22°C",
            category="sweets"
        ),
        schemas.CakeCreate(
            name="Пиріг «Мармуровий»",
            description="Ванільно-шоколадний кекс з мармуровим візерунком. Ідеально до чаю!",
            price=140.0,
            image_url="/static/images/sweet_marble_cake.jpg",
            is_available=True,
            weight=500.0,
            ingredients="Борошно, яйця, цукор, масло, какао-порошок, ваніль, розпушувач",
            shelf_life="7 днів при температурі +18...+22°C",
            category="sweets"
        ),
        schemas.CakeCreate(
            name="Сушка «Подільська»",
            description="Традиційна хрустка сушка. Ідеальна до чаю або кави.",
            price=45.0,
            image_url="/static/images/sweet_sushka.jpg",
            is_available=True,
            weight=300.0,
            ingredients="Борошно пшеничне, цукор, олія, дріжджі, сіль",
            shelf_life="60 днів при температурі +18...+22°C",
            category="sweets"
        ),
        schemas.CakeCreate(
            name="Тістечко «Мохіто»",
            description="Освіжаюче бісквітне тістечко з лаймом та м'ятою. Літній смак!",
            price=95.0,
            image_url="/static/images/sweet_mohito.jpg",
            is_available=True,
            weight=120.0,
            ingredients="Бісквіт, лайм, м'ята, вершковий крем, цукор, желатин",
            shelf_life="2 дні при температурі +2...+6°C",
            category="sweets"
        )
    ]

    for cake in cakes:
        print(f"Adding cake: {cake.name}")
        crud.create_cake(db=db, cake=cake)
    
    print("Database seeded successfully with new realistic data!")
    db.close()

if __name__ == "__main__":
    seed_data()

