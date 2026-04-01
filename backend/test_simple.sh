#!/bin/bash
API="http://localhost:5000/api"

echo "Testing API..."
echo ""
echo "1️⃣  Health Check:"
curl -s http://localhost:5000/health | head -c 100
echo ""
echo ""

echo "2️⃣  Register Vendor:"
VENDOR=$(curl -s -X POST "$API/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"TestVendor","email":"v'$(date +%s%N)'@test.com","password":"Test@123","role":"vendor","businessName":"Test"}')
echo "$VENDOR" | head -c 150
VENDOR_EMAIL=$(echo "$VENDOR" | grep -o '"email":"[^"]*' | cut -d'"' -f4)
VENDOR_TOKEN=$(curl -s -X POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"'$VENDOR_EMAIL'","password":"Test@123"}' | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo ""
echo ""

echo "3️⃣  Upload Image:"
dd if=/dev/zero of=/tmp/test.jpg bs=1K count=50 2>/dev/null
UPLOAD=$(curl -s -X POST "$API/uploads/single" \
  -H "Authorization: Bearer $VENDOR_TOKEN" \
  -F "image=@/tmp/test.jpg")
echo "$UPLOAD" | head -c 200
echo ""
echo ""

echo "4️⃣  Check Uploads Folder:"
ls -lah /home/nakul/Nakul/NanoStack/multi\ vendor/uploads/ 2>/dev/null | head -10
echo ""

if ls /home/nakul/Nakul/NanoStack/multi\ vendor/uploads/vendors/*/images/*.jpg >/dev/null 2>&1; then
  echo "✅ IMAGES UPLOADED SUCCESSFULLY!"
else
  echo "⚠️  No images found yet"
fi
