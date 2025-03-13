
;; title: vault-contract-v2
;; version:
;; summary:
;; description:

;; traits
;;
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)
(use-trait ft-trait 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.trait-sip-010.sip-010-trait)

;; token definitions
;;
(define-fungible-token ft-name)

;; constants
;;
(define-constant DEPLOYER tx-sender)
(define-constant VAULT (as-contract tx-sender))
(define-constant ONE_8 u100000000)  ;; 8 decimal places precision

(define-constant ERR-NOT-AUTHORIZED (err u1000))
(define-constant ERR-INVALID-WEIGHT (err u1001))
(define-constant ERR-UNSUPPORTED-ASSET (err u1002))
(define-constant ERR-FAILED-TO-RETRIEVE-PRICE (err u1003))
(define-constant ERR-FAILED-TO-RETRIEVE-BALANCE (err u1004))
;; data vars
;;
(define-data-var token-name (string-ascii 32) "")
(define-data-var token-symbol (string-ascii 32) "")
(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var token-decimals uint u8)
(define-data-var is-paused bool false)
(define-data-var approved-nonce uint u0)

;; data maps
;;
(define-map approved-assets-id uint principal)
(define-map approved-assets principal uint)
(define-map asset-weights principal uint)

;; public functions
;;
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (begin
        (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
        (try! (ft-transfer? ft-name amount sender recipient))
        (print {type: "ft_transfer", amount: amount, sender: sender, recipient: recipient, memo: memo})
        (ok true)))
(define-public (toggle-pause)
    (begin
        (asserts! (is-eq tx-sender DEPLOYER) ERR-NOT-AUTHORIZED)
        (var-set is-paused (not (var-get is-paused)))
        (ok true)))
(define-public (set-asset-weight (asset principal) (weight uint))
    (begin
        (asserts! (is-eq tx-sender DEPLOYER) ERR-NOT-AUTHORIZED)
        (asserts! (<= weight u10000) ERR-INVALID-WEIGHT)
        (asserts! (is-some (map-get? approved-assets asset)) ERR-UNSUPPORTED-ASSET)
        (map-set asset-weights asset weight)
        (ok true)))

;; read only functions
;;
(define-read-only (get-name) (ok (var-get token-name)))
(define-read-only (get-symbol) (ok (var-get token-symbol)))
(define-read-only (get-decimals) (ok (var-get token-decimals)))
(define-read-only (get-balance (who principal)) (ok (ft-get-balance ft-name who)))
(define-read-only (get-total-supply) (ok (ft-get-supply ft-name)))
(define-read-only (get-token-uri) (ok (var-get token-uri)))
(define-read-only (get-paused) (ok (var-get is-paused)))
(define-read-only (get-approved-nonce) (ok (var-get approved-nonce)))
(define-read-only (get-all-approved-assets) (ok (filter is-valid-principal (map unwrap-asset-id (list u1 u2 u3)))))

(define-private (get-price-diko (token (string-ascii 12)))
    (contract-call? 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-oracle-v2-3 get-price token))

(define-private (get-price-pyth (id (buff 32)))
  (match
    (contract-call?
      'SP3R4F6C1J3JQWWCVZ3S7FRRYPMYG6ZW6RZK31FXY.pyth-storage-v3
      get-price
      id
    )
    res (ok (to-uint (get price res)))
    e ERR-FAILED-TO-RETRIEVE-PRICE
  )
)

(define-read-only (get-btc-price-at (height uint))
  (let (
    (hash (unwrap-panic (get-stacks-block-info? id-header-hash height)))
  )
    (at-block hash (match
      (contract-call?
        'SP3R4F6C1J3JQWWCVZ3S7FRRYPMYG6ZW6RZK31FXY.pyth-storage-v3
        get-price
        0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
      )
      res (some (get price res))
      e none
    ))
  )
)

(define-read-only (get-ststx-price) (ok (* (get last-price (get-price-diko "stSTX")) u100)))
(define-read-only (get-stx-price) (ok (* (get last-price (get-price-diko "STX")) u100)))
;; (define-read-only (get-stx-price) (get-price-pyth 0xec7a775f46379b5e943c3526b1c8d54cd49749176b0b98e02dde68d1bd335c17))
(define-read-only (get-btc-price) (get-price-pyth 0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43))
(define-read-only (get-usd-price) (ok ONE_8))
;; (define-read-only (get-btc-price) (ok ONE_8))
;; (define-read-only (get-ststx-price) (ok ONE_8))

(define-private (get-price (symbol (string-ascii 12)))
  (if (is-eq symbol "STX")
    (get-stx-price)
  (if (is-eq symbol "sBTC")
    (get-btc-price)
  (if (is-eq symbol "USDT")
    (get-usd-price)
  (if (is-eq symbol "stSTX")
    (get-ststx-price)
    ERR-FAILED-TO-RETRIEVE-PRICE
  )))))



(define-read-only (get-asset-price (asset principal))
    (let (
        (approved-asset (try! (check-approved-asset asset)))
        (asset-symbol (get-token-symbol-for-asset asset)
    ))
    (get-price asset-symbol)))


(define-read-only (get-asset-info (asset <ft-trait>))
    (let (
        (ctx (contract-of asset))
        (balance (unwrap! (get-asset-balance ctx) ERR-FAILED-TO-RETRIEVE-BALANCE))
        (price-usd (try! (get-asset-price ctx)))
    )
        (ok {
            asset: ctx,
            balance: balance,
            weight: (default-to u0 (map-get? asset-weights ctx)),
            value-usd: (if
                (and (> balance u0) (> price-usd u0)) (/ (* balance price-usd) ONE_8) u0)
        })
    ))

(define-read-only (get-asset-info-at (asset <ft-trait>) (height uint))
    (let (
        (hash (unwrap-panic (get-stacks-block-info? id-header-hash height)))
    )
        (at-block hash (get-asset-info asset))
    ))

;; Get the Net Asset Value (NAV) of the vault
;; Iterates through all approved assets and sums their USD values
(define-read-only (get-nav (assets (list 3 <ft-trait>)) (at-height (optional uint)))
    (let (
        (height (unwrap! at-height (err u1)))
    )
        ;; (ok height)
        (if (is-some at-height)
            (ok (calculate-total-value-at assets height))
            (ok (fold calculate-total-value assets u0))
        )
    )
)

;; (define-read-only (get-nav-history (blocks (list 50 uint)))
;;     (ok (map get-nav-at-block blocks)))

;; (define-read-only (get-nav-at (height uint) (assets (list 3 <ft-trait>)))
;;     (let (
;;         (hash (unwrap-panic (get-stacks-block-info? id-header-hash height)))
;;         (nav (at-block hash (get-nav assets)))
;;     )
;;         {height: height, nav: nav }
;;     ))

;; Helper function to calculate the total value by summing up each asset's USD value
(define-private (calculate-total-value (asset <ft-trait>) (current-total uint))
  (let (
    (asset-info (unwrap-panic (get-asset-info asset)))
    (asset-value (get value-usd asset-info))
  )
    (+ current-total asset-value)
  )
)

(define-private (calculate-total-value-at (assets (list 3 <ft-trait>)) (height uint))
  (let (
    (hash (unwrap-panic (get-stacks-block-info? id-header-hash height)))
    (asset-1 (unwrap-panic (element-at? assets u0)))
    (asset-2 (unwrap-panic (element-at? assets u1)))
    (asset-3 (unwrap-panic (element-at? assets u2)))
    (asset-1-info (unwrap-panic (get-asset-info asset-1)))
    (asset-2-info (unwrap-panic (get-asset-info asset-2)))
    (asset-3-info (unwrap-panic (get-asset-info asset-3)))
    (asset-1-value (at-block hash (get value-usd asset-1-info)))
    (asset-2-value (at-block hash (get value-usd asset-2-info)))
    (asset-3-value (at-block hash (get value-usd asset-3-info)))
  )
    (+ asset-1-value asset-2-value asset-3-value)
  )
)

(define-private (get-value-at (asset <ft-trait>) (height uint))
  (let (
    (hash (unwrap-panic (get-stacks-block-info? id-header-hash height)))
    (asset-info (unwrap-panic (at-block hash (get-asset-info asset))))
    (asset-value (get value-usd asset-info))
  )
    asset-value
  )
)
;; private functions
;;
(define-private (unwrap-asset-id (id uint))
    (default-to 'SP000000000000000000002Q6VF78.none (map-get? approved-assets-id id)))
(define-private (is-valid-principal (principal principal))
    (not (is-eq principal 'SP000000000000000000002Q6VF78.none)))
(define-private (get-token-symbol-for-asset (asset principal))
    (if (is-eq asset 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wststx)
        "STX"
    (if (is-eq asset 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wsbtc)
        "sBTC"
    (if (is-eq asset 'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt)
        "USDT"
        "STX"
    ))))
(define-private (check-approved-asset (asset principal))
    (if (is-some (map-get? approved-assets asset)) (ok true) ERR-UNSUPPORTED-ASSET))
(define-private (set-approved-assets-and-weights (assets (list 3 {asset: principal, weight: uint})))
    (begin
        (asserts! (is-eq tx-sender DEPLOYER) ERR-NOT-AUTHORIZED)
        (fold process-asset-weight assets (ok true))))
(define-private (process-asset-weight (asset-data {asset: principal, weight: uint}) (previous-result (response bool uint)))
    (let (
        (asset-id (+ (var-get approved-nonce) u1))
        (asset (get asset asset-data))
    )
     (begin
        (asserts! (is-ok previous-result) previous-result)
        (asserts! (<= (get weight asset-data) u10000) ERR-INVALID-WEIGHT)
        (map-set approved-assets asset asset-id)
        (map-set approved-assets-id asset-id asset)
        (map-set asset-weights asset (get weight asset-data))
        (var-set approved-nonce asset-id)
        (ok true))))
(define-private (deposit-token (token <ft-trait>) (amount uint) (sender principal))
    (begin
        (try! (contract-call? token transfer-fixed amount sender VAULT none))
        (print {
            type: "deposit-token",
            token: token,
            amount: amount,
            sender: sender
        })
        (ok true)))
(define-private (withdraw-token (token <ft-trait>) (amount uint) (recipient principal))
    (begin
        (try! (as-contract (contract-call? token transfer-fixed amount VAULT recipient none)))
        (print {
            type: "withdraw-token",
            token: token,
            amount: amount,
            recipient: recipient
        })
        (ok true)))
(define-private (get-balance-usd)
    (contract-call? 'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt get-balance VAULT))
(define-private (get-balance-ststx)
    (contract-call? 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wststx get-balance VAULT))
(define-private (get-balance-sbtc)
    (contract-call? 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wsbtc get-balance VAULT))
(define-read-only (get-asset-balance (asset principal))
    (if (is-eq asset 'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt)
        (get-balance-usd)
    (if (is-eq asset 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wststx)
        (get-balance-ststx)
    (if (is-eq asset 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wsbtc)
        (get-balance-sbtc)
        ERR-UNSUPPORTED-ASSET  ;; Return 0 if asset not recognized
    ))))
(begin
    (var-set token-name "ft-name")
    (var-set token-symbol "ft-name")
    (set-approved-assets-and-weights (list
        {asset: 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wststx, weight: u3000}
        {asset: 'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt, weight: u3000}
        {asset: 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wsbtc, weight: u4000}
    ))
)
