#!/usr/bin/env bash
# 下载"看看身边的人"游戏所需的20张职业照片到 images/people/ 目录
# 用法：在项目根目录运行  bash scripts/download-people-images.sh

set -e

DEST="images/people"
mkdir -p "$DEST"

IMAGES=(
  "courier|https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Cyclist_delivering_packages.jpg/480px-Cyclist_delivering_packages.jpg"
  "street-sweeper|https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Street_sweeper_at_work.jpg/480px-Street_sweeper_at_work.jpg"
  "security-guard|https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Security_guard.jpg/480px-Security_guard.jpg"
  "chef|https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Executive_chef.jpg/480px-Executive_chef.jpg"
  "police|https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Police_officer_2.jpg/480px-Police_officer_2.jpg"
  "doctor|https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Medical_doctor_examining_patient.jpg/480px-Medical_doctor_examining_patient.jpg"
  "nurse|https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Nurse_smiling.jpg/480px-Nurse_smiling.jpg"
  "firefighter|https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Firefighter_at_work.jpg/480px-Firefighter_at_work.jpg"
  "construction-worker|https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Construction_worker.jpg/480px-Construction_worker.jpg"
  "bus-driver|https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Bus_driver.jpg/480px-Bus_driver.jpg"
  "barber|https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Barber_at_work.jpg/480px-Barber_at_work.jpg"
  "baker|https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Baker_working.jpg/480px-Baker_working.jpg"
  "postman|https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Postman_on_bicycle.jpg/480px-Postman_on_bicycle.jpg"
  "gardener|https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Gardener_at_work.jpg/480px-Gardener_at_work.jpg"
  "mechanic|https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Auto_mechanic.jpg/480px-Auto_mechanic.jpg"
  "waiter|https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Waiter_in_restaurant.jpg/480px-Waiter_in_restaurant.jpg"
  "cashier|https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Cashier_at_work.jpg/480px-Cashier_at_work.jpg"
  "teacher|https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Teaching_at_a_school.jpg/480px-Teaching_at_a_school.jpg"
  "cobbler|https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Cobbler_at_work.jpg/480px-Cobbler_at_work.jpg"
  "shop-owner|https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Small_shop_owner.jpg/480px-Small_shop_owner.jpg"
)

ok=0
fail=0

for entry in "${IMAGES[@]}"; do
  name="${entry%%|*}"
  url="${entry#*|}"
  dest_file="$DEST/${name}.jpg"
  printf "下载 %-22s ... " "$name"
  if curl -sL --max-time 30 -A "Mozilla/5.0" "$url" -o "$dest_file" && [ -s "$dest_file" ]; then
    echo "✓"
    (( ok++ ))
  else
    echo "✗ 失败"
    rm -f "$dest_file"
    (( fail++ ))
  fi
done

echo ""
echo "完成：成功 $ok 张，失败 $fail 张"
[ $fail -eq 0 ] && echo "所有图片已保存到 $DEST/"
