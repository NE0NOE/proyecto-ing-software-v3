// Script clásico (sin módulos ES): funciona abriendo index.html con doble clic.
// Expone window.CodeData.
window.CodeData = (function () {
'use strict';
// ============================================================
// FRAGMENTOS DE CÓDIGO REALES (extraídos del repositorio, con sus números de línea)
// Estructura: { tab, file, from, to, code, hl: [líneas resaltadas], note }
// ============================================================
const solidCode = {
 "S": [
  {
   "tab": "pricing.py",
   "file": "commerce/pricing.py",
   "from": 1,
   "to": 21,
   "code": "\"\"\"Reglas de cálculo puras, independientes de la interfaz y la base.\"\"\"\n\nfrom decimal import Decimal, ROUND_HALF_UP\n\nCENT = Decimal(\"0.01\")\n\n\ndef money(value):\n    amount = Decimal(str(value))\n    if not amount.is_finite():\n        raise ValueError(\"El importe debe ser finito\")\n    return amount.quantize(CENT, rounding=ROUND_HALF_UP)\n\n\ndef line_total(quantity, unit_price):\n    if not isinstance(quantity, int) or isinstance(quantity, bool) or quantity <= 0:\n        raise ValueError(\"La cantidad debe ser un entero positivo\")\n    price = money(unit_price)\n    if price <= 0:\n        raise ValueError(\"El precio debe ser positivo\")\n    return money(quantity * price)",
   "hl": [
    3,
    8,
    15
   ],
   "note": "Regla pura: Decimal y redondeo explícito, sin Django ni navegador. Su única razón de cambio es el cálculo monetario."
  },
  {
   "tab": "views.py",
   "file": "commerce/views.py",
   "from": 1023,
   "to": 1031,
   "code": "        rows = [(d[\"product\"].pk, d[\"quantity\"]) for d in (f.cleaned_data for f in items) if d]\n        payment_rows = [(d[\"method\"], d[\"amount\"], d[\"reference\"]) for d in (f.cleaned_data for f in payments) if d and d.get(\"amount\")]\n        try:\n            sale = checkout(actor=request.user, items=rows, payments=payment_rows, customer=customer.cleaned_data[\"customer\"], customer_name=customer.cleaned_data[\"customer_name\"], **pricing.service_kwargs())\n        except ValidationError as exc:\n            payments._non_form_errors = payments.error_class([str(exc)])\n        else:\n            messages.success(request, f\"Venta {sale.number} confirmada.\")\n            return redirect(\"sale_detail\", pk=sale.pk)",
   "hl": [
    1026
   ],
   "note": "sale_create solo adapta el formulario y delega la venta a checkout; no calcula totales ni toca inventario."
  },
  {
   "tab": "cancellation_services.py",
   "file": "commerce/cancellation_services.py",
   "from": 97,
   "to": 106,
   "code": "@transaction.atomic\ndef approve_cancellation(*, actor, cancellation_id, note, stock_note, returned_apt, refunds):\n    if not actor.has_perm(\"commerce.authorize_salecancellation\"):\n        raise ValidationError(\"No tiene permiso para aprobar anulaciones\")\n    if not note.strip() or not stock_note.strip():\n        raise ValidationError(\"Documente la decisión y qué artículos se recibieron aptos\")\n    sale_id = SaleCancellation.objects.values_list(\"sale_id\", flat=True).get(pk=cancellation_id)\n    sale = Sale.objects.select_for_update().get(pk=sale_id)\n    cancellation = SaleCancellation.objects.select_for_update().get(pk=cancellation_id)\n    if cancellation.status != SaleCancellation.Status.REQUESTED or sale.status != Sale.Status.ACTIVE:",
   "hl": [
    98
   ],
   "note": "La anulación vive en su propio servicio (permiso, transacción y auditoría), no duplicada en la plantilla."
  }
 ],
 "O": [
  {
   "tab": "models.py · políticas",
   "file": "commerce/models.py",
   "from": 476,
   "to": 507,
   "code": "class TaxPolicy(models.Model):\n    rate = models.DecimalField(max_digits=5, decimal_places=2)\n    reason = models.CharField(max_length=255)\n    active = models.BooleanField(default=True)\n    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    class Meta:\n        ordering = [\"-created_at\", \"-pk\"]\n        constraints = [\n            models.CheckConstraint(condition=Q(rate__gte=0) & Q(rate__lte=100), name=\"tax_rate_in_range\"),\n            models.UniqueConstraint(fields=[\"active\"], condition=Q(active=True), name=\"one_active_tax_policy\"),\n        ]\n\n\nclass DiscountPolicy(models.Model):\n    name = models.CharField(max_length=100)\n    rate = models.DecimalField(max_digits=5, decimal_places=2)\n    max_subtotal = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)\n    valid_from = models.DateField()\n    valid_until = models.DateField()\n    active = models.BooleanField(default=True)\n    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    class Meta:\n        ordering = [\"-created_at\", \"-pk\"]\n        constraints = [\n            models.CheckConstraint(condition=Q(rate__gt=0) & Q(rate__lte=100), name=\"discount_rate_in_range\"),\n            models.CheckConstraint(condition=Q(max_subtotal__isnull=True) | Q(max_subtotal__gt=0), name=\"discount_max_subtotal_positive\"),\n            models.CheckConstraint(condition=Q(valid_until__gte=models.F(\"valid_from\")), name=\"discount_dates_ordered\"),\n        ]",
   "hl": [
    487,
    506
   ],
   "note": "Tasas y descuentos son registros (datos) con vigencia y una sola tasa activa: agregar una nueva no exige reescribir código."
  },
  {
   "tab": "pricing_services.py · nueva tasa",
   "file": "commerce/pricing_services.py",
   "from": 67,
   "to": 77,
   "code": "@transaction.atomic\ndef set_tax_policy(*, actor, rate, reason):\n    if not actor.has_perm(\"commerce.add_taxpolicy\"):\n        raise ValidationError(\"No tiene permiso para configurar la tasa de impuesto\")\n    rate = _percent(rate, allow_zero=True)\n    if not reason.strip():\n        raise ValidationError(\"Indique el motivo de la tasa\")\n    TaxPolicy.objects.select_for_update().filter(active=True).update(active=False)\n    policy = TaxPolicy.objects.create(rate=rate, reason=reason.strip(), created_by=actor)\n    AuditEvent.objects.create(actor=actor, action=\"TAX_POLICY_SET\", entity=\"TaxPolicy\", entity_id=str(policy.pk), details={\"rate\": str(rate), \"reason\": policy.reason})\n    return policy",
   "hl": [
    74,
    75
   ],
   "note": "Una tasa nueva desactiva la anterior y crea un registro nuevo con motivo y auditoría; las facturas históricas conservan su tasa."
  },
  {
   "tab": "services.py · checkout",
   "file": "commerce/services.py",
   "from": 942,
   "to": 945,
   "code": "    tax_rate = active_tax_rate()\n    priced, subtotal, discount_amount, tax_amount, total = priced_lines(\n        requested, discount_rate=discount_rate, tax_rate=tax_rate,\n    )",
   "hl": [
    942
   ],
   "note": "checkout lee la política vigente en lugar de tener la tasa escrita en el código."
  },
  {
   "tab": "services.py · pagos (cerrado)",
   "file": "commerce/services.py",
   "from": 900,
   "to": 902,
   "code": "    for method, amount, reference in payments:\n        if method not in Payment.Method.values:\n            raise ValidationError(\"Medio de pago inválido\")",
   "hl": [
    901
   ],
   "note": "Límite honesto: los medios de pago son un conjunto cerrado a propósito; agregar uno exige tocar modelo, formulario y reglas de reintegro."
  }
 ],
 "L": [
  {
   "tab": "Venta directa",
   "file": "commerce/views.py",
   "from": 1025,
   "to": 1026,
   "code": "        try:\n            sale = checkout(actor=request.user, items=rows, payments=payment_rows, customer=customer.cleaned_data[\"customer\"], customer_name=customer.cleaned_data[\"customer_name\"], **pricing.service_kwargs())",
   "hl": [
    1026
   ],
   "note": "Vía 1: la venta directa del mostrador llama a checkout."
  },
  {
   "tab": "Borrador",
   "file": "commerce/services.py",
   "from": 621,
   "to": 626,
   "code": "    sale = checkout(\n        actor=actor, items=[(row[\"product\"].pk, row[\"quantity\"]) for row in preview[\"rows\"]],\n        payments=payments, customer_name=draft.customer_name if draft.customer_id is None else \"\", customer=draft.customer,\n        discount_policy_id=discount_policy_id, discount_exception_id=discount_exception_id,\n        discount_reason=discount_reason, source_draft_id=draft.pk,\n    )",
   "hl": [
    621,
    625
   ],
   "note": "Vía 2: confirmar un borrador termina en el mismo checkout (confirm_sale_draft)."
  },
  {
   "tab": "Cotización",
   "file": "commerce/services.py",
   "from": 365,
   "to": 370,
   "code": "    sale = checkout(\n        actor=actor, items=[(row[\"product\"].pk, row[\"quantity\"]) for row in preview[\"rows\"]],\n        payment_method=payment_method, payment_amount=payment_amount, payment_reference=payment_reference,\n        customer_name=quote.customer_name if quote.customer_id is None else \"\", customer=quote.customer,\n        discount_policy_id=discount_policy_id, discount_reason=discount_reason,\n    )",
   "hl": [
    365
   ],
   "note": "Vía 3: convertir una cotización también termina en checkout (convert_quote)."
  },
  {
   "tab": "Contrato checkout",
   "file": "commerce/services.py",
   "from": 886,
   "to": 892,
   "code": "@transaction.atomic\ndef checkout(*, actor, items, payment_method=None, payment_amount=None, payment_reference=\"\", payments=None, customer_name=\"\", customer=None, discount_policy_id=None, discount_exception_id=None, discount_reason=\"\", source_draft_id=None):\n    if not actor.has_perm(\"commerce.add_sale\"):\n        raise ValidationError(\"No tiene permiso para vender\")\n    shift = CashShift.objects.filter(operator=actor, closed_at__isnull=True).first()\n    if not shift:\n        raise ValidationError(\"Abra un turno de caja antes de vender\")",
   "hl": [
    887
   ],
   "note": "Las tres vías convergen en un solo contrato, donde se validan permiso, caja, stock, pago, descuento e impuesto. No hay herencia forzada."
  }
 ],
 "I": [
  {
   "tab": "Vista protegida",
   "file": "commerce/views.py",
   "from": 1119,
   "to": 1121,
   "code": "@login_required\n@permission_required(\"commerce.view_discountpolicy\", raise_exception=True)\ndef pricing_policies(request):",
   "hl": [
    1120
   ],
   "note": "Cada vista exige un permiso concreto y responde 403 sin él (raise_exception=True)."
  },
  {
   "tab": "Servicio",
   "file": "commerce/pricing_services.py",
   "from": 67,
   "to": 70,
   "code": "@transaction.atomic\ndef set_tax_policy(*, actor, rate, reason):\n    if not actor.has_perm(\"commerce.add_taxpolicy\"):\n        raise ValidationError(\"No tiene permiso para configurar la tasa de impuesto\")",
   "hl": [
    69
   ],
   "note": "El servicio vuelve a validar el permiso antes de escribir: no basta con ocultar el enlace."
  },
  {
   "tab": "Permiso propio",
   "file": "commerce/models.py",
   "from": 647,
   "to": 649,
   "code": "    class Meta:\n        constraints = [models.UniqueConstraint(fields=[\"sale\"], condition=Q(status__in=[\"REQUESTED\", \"APPROVED\"]), name=\"one_active_cancellation_per_sale\")]\n        permissions = [(\"authorize_salecancellation\", \"Aprobar o rechazar anulaciones\")]",
   "hl": [
    649
   ],
   "note": "Aprobar anulaciones es un permiso distinto de solicitarlas: contratos pequeños por rol."
  },
  {
   "tab": "Rol Vendedor",
   "file": "commerce/management/commands/setup_roles.py",
   "from": 8,
   "to": 17,
   "code": "    \"Vendedor\": {\n        \"view_product\", \"view_productcompatibility\", \"view_vehiclebrand\", \"view_vehiclemodel\", \"view_stockbalance\", \"add_cashshift\", \"view_cashshift\", \"add_cashmovement\", \"view_cashmovement\",\n        \"add_sale\", \"view_sale\", \"view_saleline\", \"view_payment\", \"add_saledraft\", \"change_saledraft\", \"view_saledraft\", \"view_saledraftline\",\n        \"add_customer\", \"view_customer\",\n        \"add_quote\", \"change_quote\", \"view_quote\", \"view_quoteversion\", \"view_quoteline\",\n        \"add_returnrequest\", \"change_returnrequest\", \"view_returnrequest\", \"view_returnline\",\n        \"add_warrantyclaim\", \"view_warrantyclaim\",\n        \"add_salecancellation\", \"view_salecancellation\", \"view_cancellationrefund\", \"view_cancellationline\",\n        \"view_discountpolicy\", \"add_discountexception\", \"view_discountexception\",\n    },",
   "hl": [
    10,
    16
   ],
   "note": "El Vendedor (37 permisos) puede vender y solicitar excepciones de descuento, pero no tiene add_taxpolicy, approve_discountexception ni view_auditevent: cada rol depende solo de lo que usa."
  },
  {
   "tab": "Rol Administración",
   "file": "commerce/management/commands/setup_roles.py",
   "from": 35,
   "to": 37,
   "code": "        \"add_salecancellation\", \"change_salecancellation\", \"view_salecancellation\", \"authorize_salecancellation\", \"view_cancellationrefund\", \"view_cancellationline\",\n        \"add_taxpolicy\", \"view_taxpolicy\", \"add_discountpolicy\", \"change_discountpolicy\", \"view_discountpolicy\", \"add_discountexception\", \"view_discountexception\", \"approve_discountexception\",\n    },",
   "hl": [
    36
   ],
   "note": "Administración (74 permisos) sí configura tasas y decide excepciones. Por eso la prueba 403 del Vendedor y el 302 de Administración difieren."
  },
  {
   "tab": "Sincronización",
   "file": "commerce/management/commands/setup_roles.py",
   "from": 56,
   "to": 63,
   "code": "    def handle(self, *args, **options):\n        available = {p.codename: p for p in Permission.objects.filter(content_type__app_label=\"commerce\")}\n        for name, codes in ROLE_PERMISSIONS.items():\n            missing = codes - available.keys()\n            if missing:\n                raise RuntimeError(f\"Permisos inexistentes para {name}: {sorted(missing)}\")\n            group, _ = Group.objects.get_or_create(name=name)\n            group.permissions.set(available[code] for code in sorted(codes))",
   "hl": [
    59,
    63
   ],
   "note": "setup_roles sincroniza los grupos con los permisos del modelo y falla si alguno no existe, sin crear credenciales predeterminadas."
  },
  {
   "tab": "Prueba 403",
   "file": "commerce/tests.py",
   "from": 115,
   "to": 125,
   "code": "    def test_role_protected_policy_pages_and_web_discount_request(self):\n        call_command(\"setup_roles\", verbosity=0)\n        seller = get_user_model().objects.create_user(\"role_seller\", password=\"StrongPassword!2026\")\n        seller.groups.add(Group.objects.get(name=\"Vendedor\"))\n        manager = get_user_model().objects.create_user(\"role_manager\", password=\"StrongPassword!2026\")\n        manager.groups.add(Group.objects.get(name=\"Administración\"))\n        self.client.force_login(seller)\n        self.assertEqual(self.client.post(reverse(\"pricing_policies\"), {\"kind\": \"tax\", \"rate\": \"15\", \"reason\": \"Sin permiso\"}).status_code, 403)\n        self.client.force_login(manager)\n        response = self.client.post(reverse(\"pricing_policies\"), {\"kind\": \"tax\", \"rate\": \"0\", \"reason\": \"Simulación académica sin tasa fiscal\"})\n        self.assertEqual(response.status_code, 302)",
   "hl": [
    122
   ],
   "note": "Prueba automática: el Vendedor recibe 403 al intentar configurar la tasa; Administración sí puede."
  }
 ],
 "D": [
  {
   "tab": "pricing.py",
   "file": "commerce/pricing.py",
   "from": 1,
   "to": 5,
   "code": "\"\"\"Reglas de cálculo puras, independientes de la interfaz y la base.\"\"\"\n\nfrom decimal import Decimal, ROUND_HALF_UP\n\nCENT = Decimal(\"0.01\")",
   "hl": [
    3
   ],
   "note": "La regla pura solo importa la biblioteca estándar: no depende de Django."
  },
  {
   "tab": "pricing_services.py",
   "file": "commerce/pricing_services.py",
   "from": 3,
   "to": 10,
   "code": "from decimal import Decimal, InvalidOperation\n\nfrom django.core.exceptions import ValidationError\nfrom django.db import transaction\nfrom django.utils import timezone\n\nfrom .models import AuditEvent, DiscountException, DiscountPolicy, SaleDraft, TaxPolicy\nfrom .pricing import money",
   "hl": [
    5,
    6,
    7,
    9,
    10
   ],
   "note": "El servicio depende hacia adentro: del ORM de Django, de los modelos y de las reglas puras."
  },
  {
   "tab": "cancellation_services.py",
   "file": "commerce/cancellation_services.py",
   "from": 3,
   "to": 13,
   "code": "from django.core.exceptions import ValidationError\nfrom django.db import transaction\nfrom django.db.models import F\nfrom django.utils import timezone\n\nfrom .models import (\n    AuditEvent, CancellationLine, CancellationRefund, CashMovement, CashShift,\n    Sale, SaleCancellation, StockBalance, StockMovement,\n)\nfrom .services import expected_cash\n",
   "hl": [
    12
   ],
   "note": "Dependencia parcial y deliberada: los servicios usan el ORM de Django directamente, sin repositorio abstracto."
  }
 ]
};

return { solidCode };
})();
