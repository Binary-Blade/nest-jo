'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nestjs-jo documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-940bb15508aeaf41ae2ea2c9ca73409f45a94b09ddae01af6252a6a7f5f8b282a7759bc1f7f8ed5df70e97e8963b1eee7fd9bae3ba405ab4ff1f631f4f2b384a"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-940bb15508aeaf41ae2ea2c9ca73409f45a94b09ddae01af6252a6a7f5f8b282a7759bc1f7f8ed5df70e97e8963b1eee7fd9bae3ba405ab4ff1f631f4f2b384a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-940bb15508aeaf41ae2ea2c9ca73409f45a94b09ddae01af6252a6a7f5f8b282a7759bc1f7f8ed5df70e97e8963b1eee7fd9bae3ba405ab4ff1f631f4f2b384a"' :
                                            'id="xs-controllers-links-module-AuthModule-940bb15508aeaf41ae2ea2c9ca73409f45a94b09ddae01af6252a6a7f5f8b282a7759bc1f7f8ed5df70e97e8963b1eee7fd9bae3ba405ab4ff1f631f4f2b384a"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-940bb15508aeaf41ae2ea2c9ca73409f45a94b09ddae01af6252a6a7f5f8b282a7759bc1f7f8ed5df70e97e8963b1eee7fd9bae3ba405ab4ff1f631f4f2b384a"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-940bb15508aeaf41ae2ea2c9ca73409f45a94b09ddae01af6252a6a7f5f8b282a7759bc1f7f8ed5df70e97e8963b1eee7fd9bae3ba405ab4ff1f631f4f2b384a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-940bb15508aeaf41ae2ea2c9ca73409f45a94b09ddae01af6252a6a7f5f8b282a7759bc1f7f8ed5df70e97e8963b1eee7fd9bae3ba405ab4ff1f631f4f2b384a"' :
                                        'id="xs-injectables-links-module-AuthModule-940bb15508aeaf41ae2ea2c9ca73409f45a94b09ddae01af6252a6a7f5f8b282a7759bc1f7f8ed5df70e97e8963b1eee7fd9bae3ba405ab4ff1f631f4f2b384a"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CookieService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CookieService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RefreshTokenStoreService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RefreshTokenStoreService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TokenManagementService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TokenManagementService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TokenService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TokenService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CartItemsModule.html" data-type="entity-link" >CartItemsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CartItemsModule-0eedf44f098d3e0e2169c0b4ca06fc2e930a653add0e1cef38e7375da355fc81f86db1d3cb2cec908ba0ce562956408397873f09bc126364a01b78eda683ea1e"' : 'data-bs-target="#xs-controllers-links-module-CartItemsModule-0eedf44f098d3e0e2169c0b4ca06fc2e930a653add0e1cef38e7375da355fc81f86db1d3cb2cec908ba0ce562956408397873f09bc126364a01b78eda683ea1e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CartItemsModule-0eedf44f098d3e0e2169c0b4ca06fc2e930a653add0e1cef38e7375da355fc81f86db1d3cb2cec908ba0ce562956408397873f09bc126364a01b78eda683ea1e"' :
                                            'id="xs-controllers-links-module-CartItemsModule-0eedf44f098d3e0e2169c0b4ca06fc2e930a653add0e1cef38e7375da355fc81f86db1d3cb2cec908ba0ce562956408397873f09bc126364a01b78eda683ea1e"' }>
                                            <li class="link">
                                                <a href="controllers/CartItemsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartItemsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CartItemsModule-0eedf44f098d3e0e2169c0b4ca06fc2e930a653add0e1cef38e7375da355fc81f86db1d3cb2cec908ba0ce562956408397873f09bc126364a01b78eda683ea1e"' : 'data-bs-target="#xs-injectables-links-module-CartItemsModule-0eedf44f098d3e0e2169c0b4ca06fc2e930a653add0e1cef38e7375da355fc81f86db1d3cb2cec908ba0ce562956408397873f09bc126364a01b78eda683ea1e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CartItemsModule-0eedf44f098d3e0e2169c0b4ca06fc2e930a653add0e1cef38e7375da355fc81f86db1d3cb2cec908ba0ce562956408397873f09bc126364a01b78eda683ea1e"' :
                                        'id="xs-injectables-links-module-CartItemsModule-0eedf44f098d3e0e2169c0b4ca06fc2e930a653add0e1cef38e7375da355fc81f86db1d3cb2cec908ba0ce562956408397873f09bc126364a01b78eda683ea1e"' }>
                                        <li class="link">
                                            <a href="injectables/CartItemsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartItemsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReservationDetailsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReservationDetailsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CartsModule.html" data-type="entity-link" >CartsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CartsModule-b0979a035028b526942fb6bff4e7c7e4f8bbb1354722276a914412ac483fa5047048867f61ba51a839b6b13ec87c3a07eceb8e9204d858f5c68a58dd207b134c"' : 'data-bs-target="#xs-injectables-links-module-CartsModule-b0979a035028b526942fb6bff4e7c7e4f8bbb1354722276a914412ac483fa5047048867f61ba51a839b6b13ec87c3a07eceb8e9204d858f5c68a58dd207b134c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CartsModule-b0979a035028b526942fb6bff4e7c7e4f8bbb1354722276a914412ac483fa5047048867f61ba51a839b6b13ec87c3a07eceb8e9204d858f5c68a58dd207b134c"' :
                                        'id="xs-injectables-links-module-CartsModule-b0979a035028b526942fb6bff4e7c7e4f8bbb1354722276a914412ac483fa5047048867f61ba51a839b6b13ec87c3a07eceb8e9204d858f5c68a58dd207b134c"' }>
                                        <li class="link">
                                            <a href="injectables/CartsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CommonModule.html" data-type="entity-link" >CommonModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CommonModule-03ce032a5cf01e03bf01e3ff2d8089e6a9ecef02c5cc0b40a1af109104790d43960fed6016a05e491fe1ba5cf1f7c72fec374935bbce1ca754d7d10341493e0e"' : 'data-bs-target="#xs-injectables-links-module-CommonModule-03ce032a5cf01e03bf01e3ff2d8089e6a9ecef02c5cc0b40a1af109104790d43960fed6016a05e491fe1ba5cf1f7c72fec374935bbce1ca754d7d10341493e0e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CommonModule-03ce032a5cf01e03bf01e3ff2d8089e6a9ecef02c5cc0b40a1af109104790d43960fed6016a05e491fe1ba5cf1f7c72fec374935bbce1ca754d7d10341493e0e"' :
                                        'id="xs-injectables-links-module-CommonModule-03ce032a5cf01e03bf01e3ff2d8089e6a9ecef02c5cc0b40a1af109104790d43960fed6016a05e491fe1ba5cf1f7c72fec374935bbce1ca754d7d10341493e0e"' }>
                                        <li class="link">
                                            <a href="injectables/ConvertUtilsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConvertUtilsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EncryptionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EncryptionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PaymentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QueryHelperService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueryHelperService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RedisService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RedisService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EventsModule.html" data-type="entity-link" >EventsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-EventsModule-f647af15ce61e64ae42d9c58fa98aad79150437ba8cb1d2b00679ab75bf9a17d7fc9f424ae87a734043a4340058880b607a96d89774bc5f4431eb1b33db2c4ca"' : 'data-bs-target="#xs-controllers-links-module-EventsModule-f647af15ce61e64ae42d9c58fa98aad79150437ba8cb1d2b00679ab75bf9a17d7fc9f424ae87a734043a4340058880b607a96d89774bc5f4431eb1b33db2c4ca"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EventsModule-f647af15ce61e64ae42d9c58fa98aad79150437ba8cb1d2b00679ab75bf9a17d7fc9f424ae87a734043a4340058880b607a96d89774bc5f4431eb1b33db2c4ca"' :
                                            'id="xs-controllers-links-module-EventsModule-f647af15ce61e64ae42d9c58fa98aad79150437ba8cb1d2b00679ab75bf9a17d7fc9f424ae87a734043a4340058880b607a96d89774bc5f4431eb1b33db2c4ca"' }>
                                            <li class="link">
                                                <a href="controllers/EventsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-EventsModule-f647af15ce61e64ae42d9c58fa98aad79150437ba8cb1d2b00679ab75bf9a17d7fc9f424ae87a734043a4340058880b607a96d89774bc5f4431eb1b33db2c4ca"' : 'data-bs-target="#xs-injectables-links-module-EventsModule-f647af15ce61e64ae42d9c58fa98aad79150437ba8cb1d2b00679ab75bf9a17d7fc9f424ae87a734043a4340058880b607a96d89774bc5f4431eb1b33db2c4ca"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EventsModule-f647af15ce61e64ae42d9c58fa98aad79150437ba8cb1d2b00679ab75bf9a17d7fc9f424ae87a734043a4340058880b607a96d89774bc5f4431eb1b33db2c4ca"' :
                                        'id="xs-injectables-links-module-EventsModule-f647af15ce61e64ae42d9c58fa98aad79150437ba8cb1d2b00679ab75bf9a17d7fc9f424ae87a734043a4340058880b607a96d89774bc5f4431eb1b33db2c4ca"' }>
                                        <li class="link">
                                            <a href="injectables/EventPricesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventPricesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EventSalesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventSalesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EventsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QueryHelperService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueryHelperService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentModule.html" data-type="entity-link" >PaymentModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PaymentModule-48edb2aba4033ec448f115f37b87a6d08f6872173ef3875be999bce0a8bad9a46301baf91aceabd3f76114d7566ec39f78fdb0bbcdcfa2094a506ddf11a3324b"' : 'data-bs-target="#xs-injectables-links-module-PaymentModule-48edb2aba4033ec448f115f37b87a6d08f6872173ef3875be999bce0a8bad9a46301baf91aceabd3f76114d7566ec39f78fdb0bbcdcfa2094a506ddf11a3324b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PaymentModule-48edb2aba4033ec448f115f37b87a6d08f6872173ef3875be999bce0a8bad9a46301baf91aceabd3f76114d7566ec39f78fdb0bbcdcfa2094a506ddf11a3324b"' :
                                        'id="xs-injectables-links-module-PaymentModule-48edb2aba4033ec448f115f37b87a6d08f6872173ef3875be999bce0a8bad9a46301baf91aceabd3f76114d7566ec39f78fdb0bbcdcfa2094a506ddf11a3324b"' }>
                                        <li class="link">
                                            <a href="injectables/PaymentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RedisModule.html" data-type="entity-link" >RedisModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RedisModule-89bc60f9bbb94a18acc50459d6b7ab0f79d9b18e3d096ccc925b20d9389f2249808d7f95c20cde1ac968345c99151df18c470c98826f99c3469a435cb1782472"' : 'data-bs-target="#xs-injectables-links-module-RedisModule-89bc60f9bbb94a18acc50459d6b7ab0f79d9b18e3d096ccc925b20d9389f2249808d7f95c20cde1ac968345c99151df18c470c98826f99c3469a435cb1782472"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RedisModule-89bc60f9bbb94a18acc50459d6b7ab0f79d9b18e3d096ccc925b20d9389f2249808d7f95c20cde1ac968345c99151df18c470c98826f99c3469a435cb1782472"' :
                                        'id="xs-injectables-links-module-RedisModule-89bc60f9bbb94a18acc50459d6b7ab0f79d9b18e3d096ccc925b20d9389f2249808d7f95c20cde1ac968345c99151df18c470c98826f99c3469a435cb1782472"' }>
                                        <li class="link">
                                            <a href="injectables/RedisService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RedisService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReservationDetailsModule.html" data-type="entity-link" >ReservationDetailsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ReservationDetailsModule-4af27565ed9306ada0319b07ba4252a0b4454bd160492220187857b3250331fb8c487e7f414b1ca0c44df0924b25dc36eb23579bc7f02bdafc8b65c8b3736c1b"' : 'data-bs-target="#xs-injectables-links-module-ReservationDetailsModule-4af27565ed9306ada0319b07ba4252a0b4454bd160492220187857b3250331fb8c487e7f414b1ca0c44df0924b25dc36eb23579bc7f02bdafc8b65c8b3736c1b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ReservationDetailsModule-4af27565ed9306ada0319b07ba4252a0b4454bd160492220187857b3250331fb8c487e7f414b1ca0c44df0924b25dc36eb23579bc7f02bdafc8b65c8b3736c1b"' :
                                        'id="xs-injectables-links-module-ReservationDetailsModule-4af27565ed9306ada0319b07ba4252a0b4454bd160492220187857b3250331fb8c487e7f414b1ca0c44df0924b25dc36eb23579bc7f02bdafc8b65c8b3736c1b"' }>
                                        <li class="link">
                                            <a href="injectables/ReservationDetailsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReservationDetailsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReservationsModule.html" data-type="entity-link" >ReservationsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ReservationsModule-c97ba6f60961df7c49afd86095af1a4647a42fece79e5301cc6f8fcd19f1344f6868d48c0f8bd0259e6586128dd0e4734c09e494e19f18c915727ade1d233ba3"' : 'data-bs-target="#xs-controllers-links-module-ReservationsModule-c97ba6f60961df7c49afd86095af1a4647a42fece79e5301cc6f8fcd19f1344f6868d48c0f8bd0259e6586128dd0e4734c09e494e19f18c915727ade1d233ba3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ReservationsModule-c97ba6f60961df7c49afd86095af1a4647a42fece79e5301cc6f8fcd19f1344f6868d48c0f8bd0259e6586128dd0e4734c09e494e19f18c915727ade1d233ba3"' :
                                            'id="xs-controllers-links-module-ReservationsModule-c97ba6f60961df7c49afd86095af1a4647a42fece79e5301cc6f8fcd19f1344f6868d48c0f8bd0259e6586128dd0e4734c09e494e19f18c915727ade1d233ba3"' }>
                                            <li class="link">
                                                <a href="controllers/ReservationsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReservationsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ReservationsModule-c97ba6f60961df7c49afd86095af1a4647a42fece79e5301cc6f8fcd19f1344f6868d48c0f8bd0259e6586128dd0e4734c09e494e19f18c915727ade1d233ba3"' : 'data-bs-target="#xs-injectables-links-module-ReservationsModule-c97ba6f60961df7c49afd86095af1a4647a42fece79e5301cc6f8fcd19f1344f6868d48c0f8bd0259e6586128dd0e4734c09e494e19f18c915727ade1d233ba3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ReservationsModule-c97ba6f60961df7c49afd86095af1a4647a42fece79e5301cc6f8fcd19f1344f6868d48c0f8bd0259e6586128dd0e4734c09e494e19f18c915727ade1d233ba3"' :
                                        'id="xs-injectables-links-module-ReservationsModule-c97ba6f60961df7c49afd86095af1a4647a42fece79e5301cc6f8fcd19f1344f6868d48c0f8bd0259e6586128dd0e4734c09e494e19f18c915727ade1d233ba3"' }>
                                        <li class="link">
                                            <a href="injectables/QueryHelperService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueryHelperService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReservationDetailsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReservationDetailsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReservationsProcessorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReservationsProcessorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReservationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReservationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ThrollerModule.html" data-type="entity-link" >ThrollerModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TicketsModule.html" data-type="entity-link" >TicketsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TicketsModule-1e70920b5f641b572e5af3f9d6a61abba2cfdd12586dc57727edde5ebd6d9d28c77b0254eccfca793dca1c85632f6f531afe1b92ce5153c6dbb68634ac462d04"' : 'data-bs-target="#xs-injectables-links-module-TicketsModule-1e70920b5f641b572e5af3f9d6a61abba2cfdd12586dc57727edde5ebd6d9d28c77b0254eccfca793dca1c85632f6f531afe1b92ce5153c6dbb68634ac462d04"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TicketsModule-1e70920b5f641b572e5af3f9d6a61abba2cfdd12586dc57727edde5ebd6d9d28c77b0254eccfca793dca1c85632f6f531afe1b92ce5153c6dbb68634ac462d04"' :
                                        'id="xs-injectables-links-module-TicketsModule-1e70920b5f641b572e5af3f9d6a61abba2cfdd12586dc57727edde5ebd6d9d28c77b0254eccfca793dca1c85632f6f531afe1b92ce5153c6dbb68634ac462d04"' }>
                                        <li class="link">
                                            <a href="injectables/TicketsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TicketsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionsModule.html" data-type="entity-link" >TransactionsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TransactionsModule-66de826b18a8f3339069f437a8b4397aa03db763e5767deda2ac031fb10597d4830b8fc2a5094bb354ee1b53f541feedf7ba0e9cf482d0ffd8e9b8922650c5ff"' : 'data-bs-target="#xs-controllers-links-module-TransactionsModule-66de826b18a8f3339069f437a8b4397aa03db763e5767deda2ac031fb10597d4830b8fc2a5094bb354ee1b53f541feedf7ba0e9cf482d0ffd8e9b8922650c5ff"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TransactionsModule-66de826b18a8f3339069f437a8b4397aa03db763e5767deda2ac031fb10597d4830b8fc2a5094bb354ee1b53f541feedf7ba0e9cf482d0ffd8e9b8922650c5ff"' :
                                            'id="xs-controllers-links-module-TransactionsModule-66de826b18a8f3339069f437a8b4397aa03db763e5767deda2ac031fb10597d4830b8fc2a5094bb354ee1b53f541feedf7ba0e9cf482d0ffd8e9b8922650c5ff"' }>
                                            <li class="link">
                                                <a href="controllers/TransactionsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransactionsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TransactionsModule-66de826b18a8f3339069f437a8b4397aa03db763e5767deda2ac031fb10597d4830b8fc2a5094bb354ee1b53f541feedf7ba0e9cf482d0ffd8e9b8922650c5ff"' : 'data-bs-target="#xs-injectables-links-module-TransactionsModule-66de826b18a8f3339069f437a8b4397aa03db763e5767deda2ac031fb10597d4830b8fc2a5094bb354ee1b53f541feedf7ba0e9cf482d0ffd8e9b8922650c5ff"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TransactionsModule-66de826b18a8f3339069f437a8b4397aa03db763e5767deda2ac031fb10597d4830b8fc2a5094bb354ee1b53f541feedf7ba0e9cf482d0ffd8e9b8922650c5ff"' :
                                        'id="xs-injectables-links-module-TransactionsModule-66de826b18a8f3339069f437a8b4397aa03db763e5767deda2ac031fb10597d4830b8fc2a5094bb354ee1b53f541feedf7ba0e9cf482d0ffd8e9b8922650c5ff"' }>
                                        <li class="link">
                                            <a href="injectables/QueryHelperService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueryHelperService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReservationDetailsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReservationDetailsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TransactionsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransactionsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-82765b9289154cfb6bf0a8e1978757adf6d7c3969e1e2a560c6130ffac61064b927d281750f811a4aef68386d05ac3cc7b4a593a82ccc54a14c53d20811c89c2"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-82765b9289154cfb6bf0a8e1978757adf6d7c3969e1e2a560c6130ffac61064b927d281750f811a4aef68386d05ac3cc7b4a593a82ccc54a14c53d20811c89c2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-82765b9289154cfb6bf0a8e1978757adf6d7c3969e1e2a560c6130ffac61064b927d281750f811a4aef68386d05ac3cc7b4a593a82ccc54a14c53d20811c89c2"' :
                                            'id="xs-controllers-links-module-UsersModule-82765b9289154cfb6bf0a8e1978757adf6d7c3969e1e2a560c6130ffac61064b927d281750f811a4aef68386d05ac3cc7b4a593a82ccc54a14c53d20811c89c2"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-82765b9289154cfb6bf0a8e1978757adf6d7c3969e1e2a560c6130ffac61064b927d281750f811a4aef68386d05ac3cc7b4a593a82ccc54a14c53d20811c89c2"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-82765b9289154cfb6bf0a8e1978757adf6d7c3969e1e2a560c6130ffac61064b927d281750f811a4aef68386d05ac3cc7b4a593a82ccc54a14c53d20811c89c2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-82765b9289154cfb6bf0a8e1978757adf6d7c3969e1e2a560c6130ffac61064b927d281750f811a4aef68386d05ac3cc7b4a593a82ccc54a14c53d20811c89c2"' :
                                        'id="xs-injectables-links-module-UsersModule-82765b9289154cfb6bf0a8e1978757adf6d7c3969e1e2a560c6130ffac61064b927d281750f811a4aef68386d05ac3cc7b4a593a82ccc54a14c53d20811c89c2"' }>
                                        <li class="link">
                                            <a href="injectables/AccessTokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccessTokenStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QueryHelperService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueryHelperService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Cart.html" data-type="entity-link" >Cart</a>
                                </li>
                                <li class="link">
                                    <a href="entities/CartItem.html" data-type="entity-link" >CartItem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Event.html" data-type="entity-link" >Event</a>
                                </li>
                                <li class="link">
                                    <a href="entities/EventPrice.html" data-type="entity-link" >EventPrice</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Reservation.html" data-type="entity-link" >Reservation</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ReservationDetails.html" data-type="entity-link" >ReservationDetails</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Ticket.html" data-type="entity-link" >Ticket</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Transaction.html" data-type="entity-link" >Transaction</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AddForeignKeyConstraints1712751780000.html" data-type="entity-link" >AddForeignKeyConstraints1712751780000</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCartItemDto.html" data-type="entity-link" >CreateCartItemDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateEventDto.html" data-type="entity-link" >CreateEventDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateReservationDetailsDto.html" data-type="entity-link" >CreateReservationDetailsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateReservationDto.html" data-type="entity-link" >CreateReservationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTableCartItems1712661230450.html" data-type="entity-link" >CreateTableCartItems1712661230450</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTableCarts1712661221574.html" data-type="entity-link" >CreateTableCarts1712661221574</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTableEventPrices1712642603715.html" data-type="entity-link" >CreateTableEventPrices1712642603715</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTableEvents1712572717258.html" data-type="entity-link" >CreateTableEvents1712572717258</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTableReservationDetails1712751776641.html" data-type="entity-link" >CreateTableReservationDetails1712751776641</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTableReservations1712661230451.html" data-type="entity-link" >CreateTableReservations1712661230451</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTableTickets1712717719010.html" data-type="entity-link" >CreateTableTickets1712717719010</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTableTransactions1712661230452.html" data-type="entity-link" >CreateTableTransactions1712661230452</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTableUsers1711085051379.html" data-type="entity-link" >CreateTableUsers1711085051379</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTransactionDto.html" data-type="entity-link" >CreateTransactionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link" >HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdDto.html" data-type="entity-link" >IdDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidCredentialsException.html" data-type="entity-link" >InvalidCredentialsException</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDTO.html" data-type="entity-link" >LoginDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationAndFilterDto.html" data-type="entity-link" >PaginationAndFilterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenDto.html" data-type="entity-link" >RefreshTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpDto.html" data-type="entity-link" >SignUpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCartItemDto.html" data-type="entity-link" >UpdateCartItemDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEventDto.html" data-type="entity-link" >UpdateEventDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePasswordDTO.html" data-type="entity-link" >UpdatePasswordDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateReservationDetailsDto.html" data-type="entity-link" >UpdateReservationDetailsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateReservationDto.html" data-type="entity-link" >UpdateReservationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTransactionDto.html" data-type="entity-link" >UpdateTransactionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AccessTokenGuard.html" data-type="entity-link" >AccessTokenGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccessTokenStrategy.html" data-type="entity-link" >AccessTokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConvertUtilsService.html" data-type="entity-link" >ConvertUtilsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CookieService.html" data-type="entity-link" >CookieService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EncryptionService.html" data-type="entity-link" >EncryptionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QueryHelperService.html" data-type="entity-link" >QueryHelperService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefreshTokenStoreService.html" data-type="entity-link" >RefreshTokenStoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TokenManagementService.html" data-type="entity-link" >TokenManagementService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TokenService.html" data-type="entity-link" >TokenService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WinstonLoggerService.html" data-type="entity-link" >WinstonLoggerService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/IsCreatorGuard.html" data-type="entity-link" >IsCreatorGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RoleGuard.html" data-type="entity-link" >RoleGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JWTTokens.html" data-type="entity-link" >JWTTokens</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/KeyValuePairs.html" data-type="entity-link" >KeyValuePairs</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Payload.html" data-type="entity-link" >Payload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaymentResult.html" data-type="entity-link" >PaymentResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProcessPaymentResponse.html" data-type="entity-link" >ProcessPaymentResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenConfig.html" data-type="entity-link" >TokenConfig</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});